"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getSessionToken } from "@/app/lib/session";
import type { Id } from "@/convex/_generated/dataModel";

export async function submitOwnerApplicationAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/owner");
  }

  await getConvexClient().mutation(api.ownerApplications.submit, {
    sessionToken,
    phone: String(formData.get("phone") ?? ""),
    location: String(formData.get("location") ?? ""),
    vehicleSummary: String(formData.get("vehicleSummary") ?? ""),
  });

  revalidatePath("/owner");
  redirect("/owner?submitted=1");
}

function parseNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseVehicleType(value: FormDataEntryValue | null) {
  if (value === "Compact" || value === "SUV" || value === "4x4") {
    return value;
  }

  return "SUV";
}

export async function createVehicleListingAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/owner/dashboard");
  }

  const dailyRate = parseNumber(formData.get("dailyRate"));
  const seats = parseNumber(formData.get("seats"), 5);

  if (dailyRate <= 0 || seats <= 0) {
    redirect("/owner/dashboard?listingError=invalid");
  }

  try {
    await getConvexClient().mutation(api.vehicles.createListing, {
      sessionToken,
      make: String(formData.get("make") ?? ""),
      model: String(formData.get("model") ?? ""),
      year: String(formData.get("year") ?? ""),
      category: String(formData.get("category") ?? ""),
      vehicleType: parseVehicleType(formData.get("vehicleType")),
      location: String(formData.get("location") ?? ""),
      pickup: String(formData.get("pickup") ?? ""),
      dailyRate,
      transmission: String(formData.get("transmission")) === "Manual" ? "Manual" : "Automatic",
      seats,
      range: String(formData.get("range") ?? ""),
      gravelReady: formData.get("gravelReady") === "on",
      image: String(formData.get("image") ?? ""),
      vehicleNotes: String(formData.get("vehicleNotes") ?? ""),
    });
  } catch {
    redirect("/owner/dashboard?listingError=invalid");
  }

  revalidatePath("/owner/dashboard");
  redirect("/owner/dashboard?created=1");
}

export async function updateVehicleListingAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/owner/dashboard");
  }

  const dailyRate = parseNumber(formData.get("dailyRate"));
  const seats = parseNumber(formData.get("seats"), 5);

  if (dailyRate <= 0 || seats <= 0) {
    redirect("/owner/dashboard?listingError=invalid");
  }

  try {
    await getConvexClient().mutation(api.vehicles.updateOwnerListing, {
      sessionToken,
      vehicleId: String(formData.get("vehicleId")) as Id<"vehicles">,
      dailyRate,
      pickup: String(formData.get("pickup") ?? ""),
      seats,
      range: String(formData.get("range") ?? ""),
      image: String(formData.get("image") ?? ""),
    });
  } catch {
    redirect("/owner/dashboard?listingError=save");
  }

  revalidatePath("/owner/dashboard");
  revalidatePath("/");
  redirect("/owner/dashboard?listingSaved=1");
}

export async function updateVehicleListingStatusAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/owner/dashboard");
  }

  const status = String(formData.get("status")) === "published" ? "published" : "paused";

  try {
    await getConvexClient().mutation(api.vehicles.updateOwnerListingStatus, {
      sessionToken,
      vehicleId: String(formData.get("vehicleId")) as Id<"vehicles">,
      status,
    });
  } catch {
    redirect("/owner/dashboard?listingError=status");
  }

  revalidatePath("/owner/dashboard");
  revalidatePath("/");
  redirect(`/owner/dashboard?listingStatus=${status}`);
}

export async function submitVehicleListingForReviewAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/owner/dashboard");
  }

  try {
    await getConvexClient().mutation(api.vehicles.submitListingForReview, {
      sessionToken,
      vehicleId: String(formData.get("vehicleId")) as Id<"vehicles">,
    });
  } catch {
    redirect("/owner/dashboard?listingError=status");
  }

  revalidatePath("/owner/dashboard");
  revalidatePath("/admin");
  redirect("/owner/dashboard?listingStatus=pending");
}
