import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./lib/session";
import { adjustPublicStats } from "./lib/platformStats";

function requireText(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required`);
  }

  return trimmed;
}

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
    const phone = requireText(args.phone, "Phone");
    const location = requireText(args.location, "Vehicle location");
    const vehicleSummary = requireText(args.vehicleSummary, "Vehicle summary");
    const existing = await ctx.db
      .query("ownerApplications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        phone,
        location,
        vehicleSummary,
        status: "pending",
        notes: "",
        updatedAt: now,
      });
      await ctx.db.patch(user._id, { ownerStatus: "pending", updatedAt: now });
      return existing._id;
    }

    const applicationId = await ctx.db.insert("ownerApplications", {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      phone,
      location,
      vehicleSummary,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(user._id, {
      ownerStatus: "pending",
      updatedAt: now,
    });

    await adjustPublicStats(ctx, { ownerApplications: 1 });

    return applicationId;
  },
});
