import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { getUserFromSession, requireAdmin, requireOwner } from "./lib/session";
import { adjustPublicStats } from "./lib/platformStats";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function requireText(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required`);
  }

  return trimmed;
}

function formatAverage(value: number) {
  return value.toFixed(1).replace(/\.0$/, "");
}

async function getRatingSummary(ctx: QueryCtx, vehicle: Doc<"vehicles">) {
  const ratings = await ctx.db
    .query("ratings")
    .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicle._id))
    .take(100);

  if (ratings.length > 0) {
    const average = ratings.reduce((total, rating) => total + rating.rating, 0) / ratings.length;

    return {
      label: formatAverage(average),
      average,
      count: ratings.length,
      source: "ratings",
    };
  }

  const fallbackAverage = Number.parseFloat(vehicle.rating);

  return {
    label: vehicle.rating,
    average: Number.isFinite(fallbackAverage) ? fallbackAverage : null,
    count: 0,
    source: "listing",
  };
}

async function getOwnerDetails(ctx: QueryCtx, vehicle: Doc<"vehicles">) {
  const owner = vehicle.ownerId ? await ctx.db.get(vehicle.ownerId) : null;

  return {
    _id: owner?._id ?? null,
    fullName: owner?.fullName ?? vehicle.ownerName,
    email: owner?.email ?? null,
    phone: owner?.phone ?? null,
    isVerified: owner?.isVerified ?? true,
    ownerStatus: owner?.ownerStatus ?? "approved",
  };
}

async function getViewerRatingForVehicle(
  ctx: QueryCtx,
  sessionToken: string | null | undefined,
  vehicleId: Id<"vehicles">,
) {
  if (!sessionToken) {
    return null;
  }

  const user = await getUserFromSession(ctx, sessionToken);
  if (!user) {
    return null;
  }

  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_renterId", (q) => q.eq("renterId", user._id))
    .order("desc")
    .take(50);
  const completedBooking = bookings.find(
    (booking) => booking.vehicleId === vehicleId && booking.status === "completed",
  );

  if (!completedBooking) {
    return null;
  }

  const existingRating = await ctx.db
    .query("ratings")
    .withIndex("by_bookingId", (q) => q.eq("bookingId", completedBooking._id))
    .unique();

  return {
    bookingId: completedBooking._id,
    rating: existingRating?.rating ?? null,
    note: existingRating?.note ?? "",
  };
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
    sessionToken: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db
      .query("vehicles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!vehicle || vehicle.status !== "published") {
      return null;
    }

    const [owner, ratingSummary, viewerRating] = await Promise.all([
      getOwnerDetails(ctx, vehicle),
      getRatingSummary(ctx, vehicle),
      getViewerRatingForVehicle(ctx, args.sessionToken, vehicle._id),
    ]);

    return {
      ...vehicle,
      owner,
      ratingSummary,
      viewerRating,
    };
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
    const make = requireText(args.make, "Make");
    const model = requireText(args.model, "Model");
    const year = requireText(args.year, "Year");
    const category = requireText(args.category, "Listing category");
    const location = requireText(args.location, "Location");
    const pickup = requireText(args.pickup, "Pickup");
    const range = requireText(args.range, "Best for");

    if (args.dailyRate <= 0 || args.seats <= 0) {
      throw new Error("Daily rate and seats must be greater than zero");
    }

    return await ctx.db.insert("vehicles", {
      ownerId: owner._id,
      ownerName: owner.fullName,
      slug,
      make,
      model,
      year,
      category,
      vehicleType: args.vehicleType,
      location,
      pickup,
      dailyRate: args.dailyRate,
      rating: "New",
      trips: 0,
      transmission: args.transmission,
      seats: args.seats,
      range,
      gravelReady: args.gravelReady,
      image: args.image.trim() || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      imageAlt: `${year} ${make} ${model}`,
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

export const updateOwnerListing = mutation({
  args: {
    sessionToken: v.string(),
    vehicleId: v.id("vehicles"),
    dailyRate: v.number(),
    pickup: v.string(),
    seats: v.number(),
    range: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx, args.sessionToken);
    const vehicle = await ctx.db.get(args.vehicleId);
    const pickup = requireText(args.pickup, "Pickup");
    const range = requireText(args.range, "Best for");

    if (!vehicle || vehicle.ownerId !== owner._id) {
      throw new Error("Vehicle not found");
    }

    if (args.dailyRate <= 0 || args.seats <= 0) {
      throw new Error("Daily rate and seats must be greater than zero");
    }

    await ctx.db.patch(vehicle._id, {
      dailyRate: args.dailyRate,
      pickup,
      seats: args.seats,
      range,
      image: args.image.trim() || vehicle.image,
      updatedAt: Date.now(),
    });

    return vehicle._id;
  },
});

export const submitListingForReview = mutation({
  args: {
    sessionToken: v.string(),
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx, args.sessionToken);
    const vehicle = await ctx.db.get(args.vehicleId);

    if (!vehicle || vehicle.ownerId !== owner._id) {
      throw new Error("Vehicle not found");
    }

    if (vehicle.status !== "draft") {
      throw new Error("Only returned draft listings can be submitted for review");
    }

    await ctx.db.patch(vehicle._id, {
      status: "pending",
      updatedAt: Date.now(),
    });

    return vehicle._id;
  },
});

export const updateOwnerListingStatus = mutation({
  args: {
    sessionToken: v.string(),
    vehicleId: v.id("vehicles"),
    status: v.union(v.literal("published"), v.literal("paused")),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx, args.sessionToken);
    const vehicle = await ctx.db.get(args.vehicleId);

    if (!vehicle || vehicle.ownerId !== owner._id) {
      throw new Error("Vehicle not found");
    }

    if (vehicle.status !== "published" && vehicle.status !== "paused") {
      throw new Error("Only published listings can be paused or reactivated");
    }

    await ctx.db.patch(vehicle._id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    if (vehicle.status !== args.status) {
      await adjustPublicStats(ctx, { activeListings: args.status === "published" ? 1 : -1 });
    }

    return vehicle._id;
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

    if (vehicle.status !== "published") {
      await adjustPublicStats(ctx, { activeListings: 1 });
    }

    return vehicle._id;
  },
});

export const returnListingForChanges = mutation({
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

    if (vehicle.status === "draft") {
      return vehicle._id;
    }

    await ctx.db.patch(vehicle._id, {
      status: "draft",
      updatedAt: Date.now(),
    });

    if (vehicle.status === "published") {
      await adjustPublicStats(ctx, { activeListings: -1 });
    }

    return vehicle._id;
  },
});
