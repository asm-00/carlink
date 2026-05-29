import { v } from "convex/values";
import { mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireUser } from "./lib/session";

function normalizeRating(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error("Choose a rating from 1 to 5");
  }

  return value;
}

function formatAverage(value: number) {
  return value.toFixed(1).replace(/\.0$/, "");
}

async function updateVehicleRating(ctx: MutationCtx, vehicleId: Id<"vehicles">, now: number) {
  const vehicle = await ctx.db.get(vehicleId);

  if (!vehicle) {
    return;
  }

  const ratings = await ctx.db
    .query("ratings")
    .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicleId))
    .take(100);

  if (ratings.length === 0) {
    return;
  }

  const average = ratings.reduce((total, rating) => total + rating.rating, 0) / ratings.length;

  await ctx.db.patch(vehicle._id, {
    rating: formatAverage(average),
    updatedAt: now,
  });
}

export const rateBooking = mutation({
  args: {
    sessionToken: v.string(),
    bookingId: v.id("bookings"),
    rating: v.number(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const renter = await requireUser(ctx, args.sessionToken);
    const booking = await ctx.db.get(args.bookingId);

    if (!booking || booking.renterId !== renter._id) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "completed") {
      throw new Error("Only completed trips can be rated");
    }

    const rating = normalizeRating(args.rating);
    const note = args.note?.trim();
    const now = Date.now();
    const existing = await ctx.db
      .query("ratings")
      .withIndex("by_bookingId", (q) => q.eq("bookingId", booking._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        rating,
        note: note || "",
        updatedAt: now,
      });
      await updateVehicleRating(ctx, booking.vehicleId, now);
      return existing._id;
    }

    const ratingId = await ctx.db.insert("ratings", {
      bookingId: booking._id,
      vehicleId: booking.vehicleId,
      renterId: renter._id,
      rating,
      note: note || "",
      createdAt: now,
      updatedAt: now,
      ...(booking.ownerId ? { ownerId: booking.ownerId } : {}),
    });

    await updateVehicleRating(ctx, booking.vehicleId, now);
    return ratingId;
  },
});
