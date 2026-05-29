"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getSessionToken } from "@/app/lib/session";

export async function updateProfileSettingsAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/settings");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) {
    redirect("/settings?error=missing");
  }

  await getConvexClient().mutation(api.auth.updateProfile, {
    sessionToken,
    fullName,
    phone,
  });

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/trips");
  revalidatePath("/owner");
  revalidatePath("/owner/dashboard");
  revalidatePath("/admin");
  redirect("/settings?saved=profile");
}

function parsePickupArea(value: FormDataEntryValue | null) {
  if (value === "Windhoek" || value === "Swakopmund") {
    return value;
  }

  return "Any area";
}

function parseVehicleType(value: FormDataEntryValue | null) {
  if (value === "Compact" || value === "SUV" || value === "4x4") {
    return value;
  }

  return "Any car";
}

function parseTripDays(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 4;
}

export async function updateTripPreferencesAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/settings");
  }

  try {
    await getConvexClient().mutation(api.settings.updatePreferences, {
      sessionToken,
      defaultPickupArea: parsePickupArea(formData.get("defaultPickupArea")),
      preferredVehicleType: parseVehicleType(formData.get("preferredVehicleType")),
      gravelReadyOnly: formData.get("gravelReadyOnly") === "on",
      defaultTripDays: parseTripDays(formData.get("defaultTripDays")),
    });
  } catch {
    redirect("/settings?error=preferences");
  }

  revalidatePath("/");
  revalidatePath("/settings");
  redirect("/settings?saved=preferences");
}
