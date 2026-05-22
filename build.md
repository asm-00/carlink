# Engineering Blueprint: P2P Car Rental Marketplace Engine

You are building the core foundation of a minimalist, high-fidelity peer-to-peer car rental marketplace for the Namibian market. 

## 1. Tech Stack & Environment Architecture
* **Runtime:** Bun (Strictly prefer `bun` over `npm`/`node`)
* **Framework:** Next.js (App Router, TypeScript, Tailwind CSS)
* **UI Components:** look in the design.md file for the ui components to use
* **Backend, Database, Storage & Auth:** Convex (Real-time queries, mutations, type-safe file storage, and integrated authentication schema)

---

## 2. Convex Database Schema (`convex/schema.ts`)
Implement this type-safe relational structure handling users, cars, bookings, and verified legal logs.

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(), // Links to Convex Auth / Clerk
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.union(v.literal("host"), v.literal("guest"), v.literal("admin")),
    isVerified: v.boolean(),
    verificationData: v.object({
      idOrPassportNumber: v.optional(v.string()),
      driversLicenseNumber: v.optional(v.string()),
      licenseExpiry: v.optional(v.string()),
    }),
  }).index("by_token", ["tokenIdentifier"]),

  vehicles: defineTable({
    hostId: v.id("users"),
    make: v.string(),
    model: v.string(),
    year: v.string(),
    registrationNumber: v.string(), // Namibian License Plate
    town: v.string(), // Windhoek, Swakopmund, Walvis Bay, etc.
    dailyRate: v.number(), // In NAD (N$)
    transmission: v.union(v.literal("manual"), v.literal("automatic")),
    isFourByFour: v.boolean(),
    isGravelApproved: v.boolean(),
    features: v.array(v.string()), // e.g., ["Rooftop Tent", "Aircon", "Fridge"]
    images: v.array(v.string()), // Convex Storage IDs
    isListed: v.boolean(),
  }).index("by_town", ["town"]).index("by_host", ["hostId"]),

  bookings: defineTable({
    vehicleId: v.id("vehicles"),
    guestId: v.id("users"),
    hostId: v.id("users"),
    startDate: v.string(), // ISO String
    endDate: v.string(),   // ISO String
    totalDays: v.number(),
    pricingBreakdown: v.object({
      subtotal: v.number(),
      platformFee: v.number(),
      totalAmount: v.number(),
    }),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    legalConsents: v.object({
      guestAcceptedIntermediaryToS: v.boolean(),
      hostAcceptedIntermediaryToS: v.boolean(),
      p2pContractHash: v.string(), // Simulated unique contract signature hash
      signedAt: v.string(),
    }),
  }).index("by_vehicle", ["vehicleId"]).index("by_guest", ["guestId"]).index("by_host", ["hostId"]),
});