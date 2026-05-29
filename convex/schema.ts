import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const role = v.union(v.literal("renter"), v.literal("owner"), v.literal("admin"));
const ownerStatus = v.union(
  v.literal("none"),
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
);
const vehicleStatus = v.union(v.literal("draft"), v.literal("pending"), v.literal("published"), v.literal("paused"));
const vehicleType = v.union(v.literal("Compact"), v.literal("SUV"), v.literal("4x4"));
const pickupArea = v.union(v.literal("Any area"), v.literal("Windhoek"), v.literal("Swakopmund"));
const preferredVehicleType = v.union(v.literal("Any car"), v.literal("Compact"), v.literal("SUV"), v.literal("4x4"));
const bookingStatus = v.union(
  v.literal("requested"),
  v.literal("approved"),
  v.literal("paid"),
  v.literal("active"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("disputed"),
);

export default defineSchema({
  users: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    role,
    ownerStatus,
    isVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]).index("by_role", ["role"]),

  userSettings: defineTable({
    userId: v.id("users"),
    defaultPickupArea: pickupArea,
    preferredVehicleType,
    gravelReadyOnly: v.boolean(),
    defaultTripDays: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  sessions: defineTable({
    token: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]).index("by_userId", ["userId"]),

  vehicles: defineTable({
    ownerId: v.optional(v.id("users")),
    ownerName: v.string(),
    slug: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.string(),
    category: v.string(),
    vehicleType: v.optional(vehicleType),
    location: v.string(),
    pickup: v.string(),
    dailyRate: v.number(),
    rating: v.string(),
    trips: v.number(),
    transmission: v.union(v.literal("Automatic"), v.literal("Manual")),
    seats: v.number(),
    range: v.string(),
    gravelReady: v.boolean(),
    image: v.string(),
    imageAlt: v.string(),
    highlights: v.array(v.string()),
    rules: v.array(v.string()),
    included: v.array(v.string()),
    status: vehicleStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_status_and_location", ["status", "location"])
    .index("by_status_and_vehicleType", ["status", "vehicleType"])
    .index("by_status_and_location_and_vehicleType", ["status", "location", "vehicleType"])
    .index("by_status_and_gravelReady", ["status", "gravelReady"])
    .index("by_status_and_location_and_gravelReady", ["status", "location", "gravelReady"])
    .index("by_ownerId", ["ownerId"]),

  bookings: defineTable({
    vehicleId: v.id("vehicles"),
    renterId: v.id("users"),
    ownerId: v.optional(v.id("users")),
    startDate: v.string(),
    endDate: v.string(),
    totalDays: v.number(),
    pricingBreakdown: v.object({
      subtotal: v.number(),
      platformFee: v.number(),
      totalAmount: v.number(),
    }),
    status: bookingStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_vehicleId", ["vehicleId"])
    .index("by_renterId", ["renterId"])
    .index("by_ownerId", ["ownerId"])
    .index("by_status", ["status"]),

  ratings: defineTable({
    bookingId: v.id("bookings"),
    vehicleId: v.id("vehicles"),
    ownerId: v.optional(v.id("users")),
    renterId: v.id("users"),
    rating: v.number(),
    note: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_bookingId", ["bookingId"])
    .index("by_vehicleId", ["vehicleId"])
    .index("by_ownerId", ["ownerId"])
    .index("by_renterId", ["renterId"])
    .index("by_vehicleId_and_renterId", ["vehicleId", "renterId"]),

  ownerApplications: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    vehicleSummary: v.string(),
    location: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  platformStats: defineTable({
    key: v.string(),
    activeListings: v.number(),
    completedTrips: v.number(),
    ownerApplications: v.number(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
