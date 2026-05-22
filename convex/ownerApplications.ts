import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./lib/session";

export const mine = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx, args.sessionToken);

    return await ctx.db
      .query("ownerApplications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
  },
});

export const submit = mutation({
  args: {
    sessionToken: v.string(),
    phone: v.string(),
    location: v.string(),
    vehicleSummary: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx, args.sessionToken);
    const now = Date.now();
    const existing = await ctx.db
      .query("ownerApplications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        phone: args.phone.trim(),
        location: args.location.trim(),
        vehicleSummary: args.vehicleSummary.trim(),
        status: "pending",
        updatedAt: now,
      });
      await ctx.db.patch(user._id, { ownerStatus: "pending", updatedAt: now });
      return existing._id;
    }

    const applicationId = await ctx.db.insert("ownerApplications", {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: args.phone.trim(),
      location: args.location.trim(),
      vehicleSummary: args.vehicleSummary.trim(),
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(user._id, {
      ownerStatus: "pending",
      updatedAt: now,
    });

    return applicationId;
  },
});
