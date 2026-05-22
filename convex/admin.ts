import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/session";

export const overview = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    const [applications, bookings, vehicles] = await Promise.all([
      ctx.db
        .query("ownerApplications")
        .withIndex("by_status", (q) => q.eq("status", "pending"))
        .order("desc")
        .take(20),
      ctx.db.query("bookings").withIndex("by_status", (q) => q.eq("status", "requested")).take(20),
      ctx.db.query("vehicles").withIndex("by_status", (q) => q.eq("status", "pending")).take(20),
    ]);

    return {
      queues: {
        ownerApplications: applications.length,
        bookingRequests: bookings.length,
        vehicleReviews: vehicles.length,
        payoutHolds: 0,
      },
      applications,
      bookings,
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
    await ctx.db.patch(application.userId, {
      role: "owner",
      ownerStatus: "approved",
      updatedAt: now,
    });

    return application.userId;
  },
});
