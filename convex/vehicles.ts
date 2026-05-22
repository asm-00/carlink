import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireOwner } from "./lib/session";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export const listPublished = query({
  args: {
    location: v.optional(v.string()),
    vehicleType: v.optional(v.union(v.literal("Compact"), v.literal("SUV"), v.literal("4x4"))),
    gravelReady: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const hasLocation = Boolean(args.location && args.location !== "Any area");

    if (args.gravelReady) {
      if (hasLocation) {
        return await ctx.db
          .query("vehicles")
          .withIndex("by_status_and_location_and_gravelReady", (q) =>
            q.eq("status", "published").eq("location", args.location as string).eq("gravelReady", true),
          )
          .take(24);
      }

      return await ctx.db
        .query("vehicles")
        .withIndex("by_status_and_gravelReady", (q) => q.eq("status", "published").eq("gravelReady", true))
        .take(24);
    }

    if (args.vehicleType) {
      if (hasLocation) {
        return await ctx.db
          .query("vehicles")
          .withIndex("by_status_and_location_and_vehicleType", (q) =>
            q.eq("status", "published").eq("location", args.location as string).eq("vehicleType", args.vehicleType),
          )
          .take(24);
      }

      return await ctx.db
        .query("vehicles")
        .withIndex("by_status_and_vehicleType", (q) => q.eq("status", "published").eq("vehicleType", args.vehicleType))
        .take(24);
    }

    if (hasLocation) {
      return await ctx.db
        .query("vehicles")
        .withIndex("by_status_and_location", (q) =>
          q.eq("status", "published").eq("location", args.location as string),
        )
        .take(24);
    }

    return await ctx.db
      .query("vehicles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(24);
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db
      .query("vehicles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!vehicle || vehicle.status !== "published") {
      return null;
    }

    return vehicle;
  },
});

export const listMine = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx, args.sessionToken);

    return await ctx.db
      .query("vehicles")
      .withIndex("by_ownerId", (q) => q.eq("ownerId", owner._id))
      .order("desc")
      .take(50);
  },
});

export const createListing = mutation({
  args: {
    sessionToken: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.string(),
    category: v.string(),
    vehicleType: v.union(v.literal("Compact"), v.literal("SUV"), v.literal("4x4")),
    location: v.string(),
    pickup: v.string(),
    dailyRate: v.number(),
    transmission: v.union(v.literal("Automatic"), v.literal("Manual")),
    seats: v.number(),
    range: v.string(),
    gravelReady: v.boolean(),
    image: v.string(),
    vehicleNotes: v.string(),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx, args.sessionToken);
    const now = Date.now();
    const baseSlug = slugify(`${args.year} ${args.make} ${args.model}`);
    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

    return await ctx.db.insert("vehicles", {
      ownerId: owner._id,
      ownerName: owner.fullName,
      slug,
      make: args.make.trim(),
      model: args.model.trim(),
      year: args.year.trim(),
      category: args.category.trim(),
      vehicleType: args.vehicleType,
      location: args.location.trim(),
      pickup: args.pickup.trim(),
      dailyRate: args.dailyRate,
      rating: "New",
      trips: 0,
      transmission: args.transmission,
      seats: args.seats,
      range: args.range.trim(),
      gravelReady: args.gravelReady,
      image: args.image.trim() || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      imageAlt: `${args.year} ${args.make} ${args.model}`,
      highlights: [
        args.transmission,
        `${args.seats} seats`,
        args.gravelReady ? "Gravel ready" : "City ready",
        "Owner managed",
      ],
      rules: ["Valid license required", "Return with same fuel level"],
      included: ["Owner approval workflow", "Booking request tracking", args.vehicleNotes.trim() || "Vehicle details pending review"],
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const approveListing = mutation({
  args: {
    sessionToken: v.string(),
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);

    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    await ctx.db.patch(vehicle._id, {
      status: "published",
      updatedAt: Date.now(),
    });

    return vehicle._id;
  },
});
