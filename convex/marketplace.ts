import { query } from "./_generated/server";

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db
      .query("platformStats")
      .withIndex("by_key", (q) => q.eq("key", "public"))
      .unique();

    return (
      stats ?? {
        activeListings: 0,
        completedTrips: 0,
        ownerApplications: 0,
      }
    );
  },
});
