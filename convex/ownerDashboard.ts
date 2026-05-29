import { v } from "convex/values";
import { query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { requireOwner } from "./lib/session";

function sumBookings(bookings: Array<Doc<"bookings">>, statuses: Array<Doc<"bookings">["status"]>) {
  const allowed = new Set(statuses);

  return bookings.reduce((total, booking) => {
    if (!allowed.has(booking.status)) {
      return total;
    }

    return total + booking.pricingBreakdown.totalAmount;
  }, 0);
}

export const overview = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx, args.sessionToken);
    const [vehicles, bookings] = await Promise.all([
      ctx.db
        .query("vehicles")
        .withIndex("by_ownerId", (q) => q.eq("ownerId", owner._id))
        .order("desc")
        .take(50),
      ctx.db
        .query("bookings")
        .withIndex("by_ownerId", (q) => q.eq("ownerId", owner._id))
        .order("desc")
        .take(100),
    ]);

    const bookingsWithDetails = await Promise.all(
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
                phone: renter.phone ?? null,
              }
            : null,
        };
      }),
    );

    const openRequests = bookings.filter((booking) => booking.status === "requested").length;
    const readyToStart = bookings.filter((booking) => booking.status === "paid").length;
    const activeTrips = bookings.filter((booking) => booking.status === "active").length;
    const completedTrips = bookings.filter((booking) => booking.status === "completed").length;
    const draftListings = vehicles.filter((vehicle) => vehicle.status === "draft").length;
    const publishedListings = vehicles.filter((vehicle) => vehicle.status === "published").length;
    const pendingListings = vehicles.filter((vehicle) => vehicle.status === "pending").length;
    const pausedListings = vehicles.filter((vehicle) => vehicle.status === "paused").length;

    return {
      owner: {
        fullName: owner.fullName,
        email: owner.email,
      },
      metrics: {
        openRequests,
        readyToStart,
        activeTrips,
        completedTrips,
        draftListings,
        publishedListings,
        pendingListings,
        pausedListings,
        confirmedRevenue: sumBookings(bookings, ["paid", "active", "completed"]),
        completedRevenue: sumBookings(bookings, ["completed"]),
      },
      vehicles,
      bookings: bookingsWithDetails,
      actionQueue: bookingsWithDetails.filter((booking) =>
        booking.status === "requested" || booking.status === "paid" || booking.status === "active"
      ),
    };
  },
});
