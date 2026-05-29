import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { getUserFromSession, requireUser } from "./lib/session";

const pickupArea = v.union(v.literal("Any area"), v.literal("Windhoek"), v.literal("Swakopmund"));
const preferredVehicleType = v.union(v.literal("Any car"), v.literal("Compact"), v.literal("SUV"), v.literal("4x4"));

const defaultSettings = {
  defaultPickupArea: "Any area" as const,
  preferredVehicleType: "Any car" as const,
  gravelReadyOnly: false,
  defaultTripDays: 4,
};

function materializeSettings(settings: Doc<"userSettings"> | null) {
  if (!settings) {
    return {
      ...defaultSettings,
      persisted: false,
      updatedAt: null,
    };
  }

  return {
    defaultPickupArea: settings.defaultPickupArea,
    preferredVehicleType: settings.preferredVehicleType,
    gravelReadyOnly: settings.gravelReadyOnly,
    defaultTripDays: settings.defaultTripDays,
    persisted: true,
    updatedAt: settings.updatedAt,
  };
}

function normalizeTripDays(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Choose a valid trip length");
  }

  const days = Math.round(value);
  if (days < 1 || days > 30) {
    throw new Error("Trip length must be between 1 and 30 days");
  }

  return days;
}

export const preferences = query({
  args: {
    sessionToken: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    if (!args.sessionToken) {
      return materializeSettings(null);
    }

    const user = await getUserFromSession(ctx, args.sessionToken);
    if (!user) {
      return materializeSettings(null);
    }

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    return materializeSettings(settings);
  },
});

export const overview = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx, args.sessionToken);
    const [settings, ownerApplication, renterBookings] = await Promise.all([
      ctx.db
        .query("userSettings")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique(),
      ctx.db
        .query("ownerApplications")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .unique(),
      ctx.db
        .query("bookings")
        .withIndex("by_renterId", (q) => q.eq("renterId", user._id))
        .order("desc")
        .take(100),
    ]);

    const [ownerVehicles, ownerBookings] =
      user.role === "owner" || user.role === "admin"
        ? await Promise.all([
            ctx.db
              .query("vehicles")
              .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
              .order("desc")
              .take(100),
            ctx.db
              .query("bookings")
              .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
              .order("desc")
              .take(100),
          ])
        : [[], []];

    return {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone ?? null,
        role: user.role,
        ownerStatus: user.ownerStatus,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      settings: materializeSettings(settings),
      ownerApplication,
      summary: {
        totalBookings: renterBookings.length,
        needsActionBookings: renterBookings.filter(
          (booking) => booking.status === "requested" || booking.status === "approved",
        ).length,
        activeTrips: renterBookings.filter((booking) => booking.status === "paid" || booking.status === "active").length,
        completedTrips: renterBookings.filter((booking) => booking.status === "completed").length,
        totalListings: ownerVehicles.length,
        publishedListings: ownerVehicles.filter((vehicle) => vehicle.status === "published").length,
        pendingListings: ownerVehicles.filter((vehicle) => vehicle.status === "pending").length,
        ownerOpenRequests: ownerBookings.filter((booking) => booking.status === "requested").length,
      },
    };
  },
});

export const updatePreferences = mutation({
  args: {
    sessionToken: v.string(),
    defaultPickupArea: pickupArea,
    preferredVehicleType,
    gravelReadyOnly: v.boolean(),
    defaultTripDays: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx, args.sessionToken);
    const now = Date.now();
    const defaultTripDays = normalizeTripDays(args.defaultTripDays);
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    const settings = {
      defaultPickupArea: args.defaultPickupArea,
      preferredVehicleType: args.preferredVehicleType,
      gravelReadyOnly: args.gravelReadyOnly,
      defaultTripDays,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, settings);
      return existing._id;
    }

    return await ctx.db.insert("userSettings", {
      userId: user._id,
      ...settings,
      createdAt: now,
    });
  },
});
