import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { requireOwner, requireUser } from "./lib/session";
import { adjustPublicStats } from "./lib/platformStats";

function daysBetween(startDate: string, endDate: string) {
  const start = Date.parse(startDate);
  const end = Date.parse(endDate);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error("Choose valid trip dates");
  }

  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
}

async function recordCompletedTrip(ctx: MutationCtx, booking: Doc<"bookings">, now: number) {
  const vehicle = await ctx.db.get(booking.vehicleId);

  if (vehicle) {
    await ctx.db.patch(vehicle._id, {
      trips: vehicle.trips + 1,
      updatedAt: now,
    });
  }

  await adjustPublicStats(ctx, { completedTrips: 1 });
}

const availabilityBlockingStatuses = new Set<Doc<"bookings">["status"]>(["approved", "paid", "active"]);

function datesOverlap(
  firstStartDate: string,
  firstEndDate: string,
  secondStartDate: string,
  secondEndDate: string,
) {
  const firstStart = Date.parse(firstStartDate);
  const firstEnd = Date.parse(firstEndDate);
  const secondStart = Date.parse(secondStartDate);
  const secondEnd = Date.parse(secondEndDate);

  if (
    !Number.isFinite(firstStart) ||
    !Number.isFinite(firstEnd) ||
    !Number.isFinite(secondStart) ||
    !Number.isFinite(secondEnd)
  ) {
    return false;
  }

  return firstStart < secondEnd && secondStart < firstEnd;
}

async function assertVehicleAvailable(
  ctx: MutationCtx,
  vehicleId: Id<"vehicles">,
  startDate: string,
  endDate: string,
  ignoreBookingId?: Id<"bookings">,
) {
  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicleId))
    .order("desc")
    .take(100);

  const hasConflict = bookings.some(
    (booking) =>
      booking._id !== ignoreBookingId &&
      availabilityBlockingStatuses.has(booking.status) &&
      datesOverlap(startDate, endDate, booking.startDate, booking.endDate),
  );

  if (hasConflict) {
    throw new Error("Vehicle is already booked for those dates");
  }
}

export const requestBooking = mutation({
  args: {
    sessionToken: v.string(),
    vehicleId: v.id("vehicles"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const renter = await requireUser(ctx, args.sessionToken);
    const vehicle = await ctx.db.get(args.vehicleId);

    if (!vehicle || vehicle.status !== "published") {
      throw new Error("Vehicle is not available");
    }

    if (vehicle.ownerId === renter._id) {
      throw new Error("Owners cannot book their own listing");
    }

    const totalDays = daysBetween(args.startDate, args.endDate);
    await assertVehicleAvailable(ctx, vehicle._id, args.startDate, args.endDate);

    const subtotal = totalDays * vehicle.dailyRate;
    const platformFee = Math.round(subtotal * 0.12);
    const now = Date.now();

    return await ctx.db.insert("bookings", {
      vehicleId: vehicle._id,
      renterId: renter._id,
      startDate: args.startDate,
      endDate: args.endDate,
      totalDays,
      pricingBreakdown: {
        subtotal,
        platformFee,
        totalAmount: subtotal + platformFee,
      },
      status: "requested",
      createdAt: now,
      updatedAt: now,
      ...(vehicle.ownerId ? { ownerId: vehicle.ownerId } : {}),
    });
  },
});

export const myBookings = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx, args.sessionToken);
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_renterId", (q) => q.eq("renterId", user._id))
      .order("desc")
      .take(20);

    return await Promise.all(
      bookings.map(async (booking) => {
        const [vehicle, rating] = await Promise.all([
          ctx.db.get(booking.vehicleId),
          ctx.db
            .query("ratings")
            .withIndex("by_bookingId", (q) => q.eq("bookingId", booking._id))
            .unique(),
        ]);

        return {
          ...booking,
          vehicle,
          rating: rating
            ? {
                _id: rating._id,
                rating: rating.rating,
                note: rating.note ?? "",
                updatedAt: rating.updatedAt,
              }
            : null,
        };
      }),
    );
  },
});

export const ownerBookings = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx, args.sessionToken);
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", owner._id))
      .order("desc")
      .take(50);

    return await Promise.all(
      bookings.map(async (booking) => {
        const [vehicle, renter] = await Promise.all([
          ctx.db.get(booking.vehicleId),
          ctx.db.get(booking.renterId),
        ]);

        return {
          ...booking,
          vehicle,
          renter: renter
            ? {
                fullName: renter.fullName,
                email: renter.email,
              }
            : null,
        };
      }),
    );
  },
});

export const renterPay = mutation({
  args: {
    sessionToken: v.string(),
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const renter = await requireUser(ctx, args.sessionToken);
    const booking = await ctx.db.get(args.bookingId);

    if (!booking || booking.renterId !== renter._id) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "approved") {
      throw new Error("Booking is not ready for payment");
    }

    await ctx.db.patch(booking._id, {
      status: "paid",
      updatedAt: Date.now(),
    });

    return booking._id;
  },
});

export const renterCancel = mutation({
  args: {
    sessionToken: v.string(),
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    const renter = await requireUser(ctx, args.sessionToken);
    const booking = await ctx.db.get(args.bookingId);

    if (!booking || booking.renterId !== renter._id) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "requested" && booking.status !== "approved") {
      throw new Error("This trip can no longer be cancelled here");
    }

    await ctx.db.patch(booking._id, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return booking._id;
  },
});

export const ownerUpdateStatus = mutation({
  args: {
    sessionToken: v.string(),
    bookingId: v.id("bookings"),
    status: v.union(
      v.literal("approved"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("disputed"),
    ),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx, args.sessionToken);
    const booking = await ctx.db.get(args.bookingId);

    if (!booking || booking.ownerId !== owner._id) {
      throw new Error("Booking not found");
    }

    const allowed =
      (booking.status === "requested" && (args.status === "approved" || args.status === "cancelled")) ||
      (booking.status === "paid" && (args.status === "active" || args.status === "disputed")) ||
      (booking.status === "active" && (args.status === "completed" || args.status === "disputed"));

    if (!allowed) {
      throw new Error("Invalid booking transition");
    }

    if (args.status === "approved") {
      await assertVehicleAvailable(ctx, booking.vehicleId, booking.startDate, booking.endDate, booking._id);
    }

    const now = Date.now();

    await ctx.db.patch(booking._id, {
      status: args.status,
      updatedAt: now,
    });

    if (args.status === "completed") {
      await recordCompletedTrip(ctx, booking, now);
    }

    return booking._id;
  },
});
