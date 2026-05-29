import type { MutationCtx } from "../_generated/server";

type StatDeltas = {
  activeListings?: number;
  completedTrips?: number;
  ownerApplications?: number;
};

export async function adjustPublicStats(ctx: MutationCtx, deltas: StatDeltas) {
  const now = Date.now();
  const existing = await ctx.db
    .query("platformStats")
    .withIndex("by_key", (q) => q.eq("key", "public"))
    .unique();

  if (!existing) {
    await ctx.db.insert("platformStats", {
      key: "public",
      activeListings: Math.max(0, deltas.activeListings ?? 0),
      completedTrips: Math.max(0, deltas.completedTrips ?? 0),
      ownerApplications: Math.max(0, deltas.ownerApplications ?? 0),
      updatedAt: now,
    });
    return;
  }

  await ctx.db.patch(existing._id, {
    activeListings: Math.max(0, existing.activeListings + (deltas.activeListings ?? 0)),
    completedTrips: Math.max(0, existing.completedTrips + (deltas.completedTrips ?? 0)),
    ownerApplications: Math.max(0, existing.ownerApplications + (deltas.ownerApplications ?? 0)),
    updatedAt: now,
  });
}
