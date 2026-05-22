"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getSessionToken } from "@/app/lib/session";

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

  revalidatePath("/owner/dashboard");
  redirect("/owner/dashboard?created=1");
}
