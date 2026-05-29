import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/session";

export const overview = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    const [applications, bookings, vehicles, stats] = await Promise.all([
      ctx.db
        .query("ownerApplications")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .order("desc")
        .take(50),
      ctx.db
        .query("bookings")
        .withIndex("by_status", (q) => q.eq("status", "requested"))
        .order("desc")
        .take(50),
      ctx.db
        .query("vehicles")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .order("desc")
        .take(50),
      ctx.db
        .query("platformStats")
        .withIndex("by_key", (q) => q.eq("key", "public"))
        .unique(),
    ]);
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const [vehicle, renter] = await Promise.all([
          ctx.db.get(booking.vehicleId),
          ctx.db.get(booking.renterId),
        ]);

        return {
          ...booking,
          vehicle: vehicle
            ? {
                year: vehicle.year,
                make: vehicle.make,
                model: vehicle.model,
                ownerName: vehicle.ownerName,
              }
            : null,
          renter: renter
            ? {
                fullName: renter.fullName,
                email: renter.email,
              }
            : null,
        };
      }),
    );

    return {
      queues: {
        ownerApplications: applications.length,
        bookingRequests: bookings.length,
        vehicleReviews: vehicles.length,
      },
      stats: stats ?? {
        activeListings: 0,
        completedTrips: 0,
        ownerApplications: 0,
      },
      applications,
      bookings: bookingsWithDetails,
      vehicles,
    };
  },
});

export const approveOwner = mutation({
  args: {
    sessionToken: v.string(),
    applicationId: v.id("ownerApplications"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    const now = Date.now();
    await ctx.db.patch(application._id, {
      status: "approved",
      updatedAt: now,
    });
    const user = await ctx.db.get(application.userId);
    await ctx.db.patch(application.userId, {
      role: user?.role === "admin" ? "admin" : "owner",
      ownerStatus: "approved",
      updatedAt: now,
    });

    return application.userId;
  },
});

export const rejectOwner = mutation({
  args: {
    sessionToken: v.string(),
    applicationId: v.id("ownerApplications"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    const user = await ctx.db.get(application.userId);
    const now = Date.now();

    await ctx.db.patch(application._id, {
      status: "rejected",
      notes: "Admin rejected this application. The applicant can update and resubmit.",
      updatedAt: now,
    });

    if (user) {
      await ctx.db.patch(user._id, {
        role: user.role === "admin" ? "admin" : "renter",
        ownerStatus: "rejected",
        updatedAt: now,
      });
    }

    return application.userId;
  },
});
