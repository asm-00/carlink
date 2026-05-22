import { v } from "convex/values";
import { mutation } from "./_generated/server";

const seedVehicles = [
  {
    slug: "toyota-hilux-double-cab",
    make: "Toyota",
    model: "Hilux Double Cab",
    year: "2024",
    category: "4x4 double cab",
    vehicleType: "4x4" as const,
    location: "Windhoek",
    pickup: "Windhoek CBD pickup",
    dailyRate: 1050,
    rating: "4.96",
    trips: 58,
    transmission: "Automatic" as const,
    seats: 5,
    range: "Long-distance and gravel ready",
    gravelReady: true,
    ownerName: "M. Ihemba",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "White pickup truck parked on an open road",
    highlights: ["4x4", "Double cab", "Canopy", "USB charging"],
    rules: ["No border crossing without approval", "Return with same fuel level"],
    included: ["Comprehensive owner insurance", "Digital handover checklist", "Roadside support"],
  },
  {
    slug: "volkswagen-polo-vivo-city",
    make: "Volkswagen",
    model: "Polo Vivo",
    year: "2022",
    category: "Compact hatchback",
    vehicleType: "Compact" as const,
    location: "Windhoek",
    pickup: "Airport delivery available",
    dailyRate: 480,
    rating: "4.91",
    trips: 74,
    transmission: "Manual" as const,
    seats: 5,
    range: "City errands and short trips",
    gravelReady: false,
    ownerName: "T. Amadhila",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Black compact car photographed from the front",
    highlights: ["Fuel efficient", "Bluetooth", "Compact parking", "Air conditioning"],
    rules: ["City use preferred", "No smoking"],
    included: ["Owner insurance confirmation", "Instant price breakdown", "Trip receipts"],
  },
  {
    slug: "toyota-corolla-quest-sedan",
    make: "Toyota",
    model: "Corolla Quest",
    year: "2022",
    category: "Compact sedan",
    vehicleType: "Compact" as const,
    location: "Windhoek",
    pickup: "Eros pickup point",
    dailyRate: 540,
    rating: "4.89",
    trips: 49,
    transmission: "Automatic" as const,
    seats: 5,
    range: "Daily commuting",
    gravelReady: false,
    ownerName: "J. Shikongo",
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Silver sedan parked on a paved surface",
    highlights: ["Automatic", "Fuel efficient", "Large boot", "Air conditioning"],
    rules: ["No smoking", "Report any long-distance route before pickup"],
    included: ["Owner insurance confirmation", "Digital handover checklist", "Trip receipts"],
  },
  {
    slug: "ford-ranger-double-cab",
    make: "Ford",
    model: "Ranger Double Cab",
    year: "2023",
    category: "4x4 double cab",
    vehicleType: "4x4" as const,
    location: "Walvis Bay",
    pickup: "Walvis Bay airport pickup",
    dailyRate: 990,
    rating: "4.93",
    trips: 37,
    transmission: "Automatic" as const,
    seats: 5,
    range: "Coastal and gravel routes",
    gravelReady: true,
    ownerName: "A. Naruseb",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Blue utility vehicle parked outdoors",
    highlights: ["4x4", "Tow bar", "Canopy", "Reverse camera"],
    rules: ["No dune driving without approval", "Return with same fuel level"],
    included: ["Comprehensive owner insurance", "Photo handover", "Roadside support"],
  },
  {
    slug: "toyota-fortuner-family",
    make: "Toyota",
    model: "Fortuner",
    year: "2021",
    category: "Seven-seat SUV",
    vehicleType: "SUV" as const,
    location: "Swakopmund",
    pickup: "Swakopmund town pickup",
    dailyRate: 870,
    rating: "4.88",
    trips: 44,
    transmission: "Automatic" as const,
    seats: 7,
    range: "Family travel",
    gravelReady: true,
    ownerName: "L. Kavezembi",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "White SUV parked near a road",
    highlights: ["7 seats", "Reverse camera", "Gravel approved", "Large boot"],
    rules: ["Pets by approval", "Report beach driving before booking"],
    included: ["Mileage allowance", "Photo handover", "Host messaging"],
  },
  {
    slug: "isuzu-dmax-double-cab",
    make: "Isuzu",
    model: "D-Max Double Cab",
    year: "2022",
    category: "4x4 bakkie",
    vehicleType: "4x4" as const,
    location: "Otjiwarongo",
    pickup: "Otjiwarongo town centre",
    dailyRate: 940,
    rating: "4.9",
    trips: 29,
    transmission: "Manual" as const,
    seats: 5,
    range: "Farm roads and northern trips",
    gravelReady: true,
    ownerName: "K. Ndapewa",
    image:
      "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Pickup truck parked near a dry landscape",
    highlights: ["4x4", "Manual", "High clearance", "Load bin"],
    rules: ["No livestock transport", "Return clean after gravel routes"],
    included: ["Comprehensive owner insurance", "Digital handover checklist", "Roadside support"],
  },
  {
    slug: "toyota-land-cruiser-prado",
    make: "Toyota",
    model: "Land Cruiser Prado",
    year: "2020",
    category: "Premium 4x4 SUV",
    vehicleType: "4x4" as const,
    location: "Windhoek",
    pickup: "Klein Windhoek pickup",
    dailyRate: 1280,
    rating: "4.97",
    trips: 26,
    transmission: "Automatic" as const,
    seats: 7,
    range: "Long-distance touring",
    gravelReady: true,
    ownerName: "P. Gaingos",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Large white SUV parked outside",
    highlights: ["4x4", "7 seats", "Cruise control", "Roof rails"],
    rules: ["No off-road tracks without approval", "Border documents required for cross-border trips"],
    included: ["Comprehensive owner insurance", "Roadside support", "Host messaging"],
  },
  {
    slug: "nissan-np200-light-bakkie",
    make: "Nissan",
    model: "NP200",
    year: "2021",
    category: "Light bakkie",
    vehicleType: "Compact" as const,
    location: "Windhoek",
    pickup: "Katutura pickup point",
    dailyRate: 450,
    rating: "4.84",
    trips: 62,
    transmission: "Manual" as const,
    seats: 2,
    range: "Errands and small loads",
    gravelReady: true,
    ownerName: "S. Uugwanga",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Small utility vehicle on a road",
    highlights: ["Light bakkie", "Fuel efficient", "Load bin", "Manual"],
    rules: ["No heavy construction loads", "Secure cargo before driving"],
    included: ["Owner insurance confirmation", "Trip receipts", "Digital handover checklist"],
  },
  {
    slug: "suzuki-swift-city",
    make: "Suzuki",
    model: "Swift",
    year: "2023",
    category: "Compact hatchback",
    vehicleType: "Compact" as const,
    location: "Swakopmund",
    pickup: "Vineta pickup point",
    dailyRate: 430,
    rating: "4.87",
    trips: 41,
    transmission: "Automatic" as const,
    seats: 5,
    range: "Coastal city driving",
    gravelReady: false,
    ownerName: "N. !Garoes",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Compact hatchback car parked near a wall",
    highlights: ["Automatic", "Compact parking", "Fuel efficient", "Bluetooth"],
    rules: ["City use preferred", "No smoking"],
    included: ["Owner insurance confirmation", "Instant price breakdown", "Trip receipts"],
  },
  {
    slug: "kia-picanto-town-runner",
    make: "Kia",
    model: "Picanto",
    year: "2022",
    category: "Small city hatchback",
    vehicleType: "Compact" as const,
    location: "Ongwediva",
    pickup: "Ongwediva mall pickup",
    dailyRate: 390,
    rating: "4.82",
    trips: 35,
    transmission: "Manual" as const,
    seats: 4,
    range: "Town trips",
    gravelReady: false,
    ownerName: "E. Haipinge",
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Small hatchback parked in a city street",
    highlights: ["Manual", "Low fuel use", "Easy parking", "Air conditioning"],
    rules: ["No gravel routes", "Return with same fuel level"],
    included: ["Owner insurance confirmation", "Digital handover checklist", "Trip receipts"],
  },
];

export const seed = mutation({
  args: {
    confirm: v.literal("seed-namibia-local-cars"),
  },
  handler: async (ctx) => {
    const now = Date.now();

    for (const vehicle of seedVehicles) {
      const existing = await ctx.db
        .query("vehicles")
        .withIndex("by_slug", (q) => q.eq("slug", vehicle.slug))
        .unique();

      const payload = {
        ...vehicle,
        status: "published" as const,
        updatedAt: now,
      };

      if (existing) {
        await ctx.db.patch(existing._id, payload);
      } else {
        await ctx.db.insert("vehicles", {
          ...payload,
          createdAt: now,
        });
      }
    }

    const stats = await ctx.db
      .query("platformStats")
      .withIndex("by_key", (q) => q.eq("key", "public"))
      .unique();

    const statsPayload = {
      key: "public",
      activeListings: seedVehicles.length,
      completedTrips: seedVehicles.reduce((total, vehicle) => total + vehicle.trips, 0),
      ownerApplications: seedVehicles.length,
      updatedAt: now,
    };

    if (stats) {
      await ctx.db.patch(stats._id, statsPayload);
    } else {
      await ctx.db.insert("platformStats", statsPayload);
    }

    return { seeded: seedVehicles.length };
  },
});
