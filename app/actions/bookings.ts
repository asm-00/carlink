"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getSessionToken } from "@/app/lib/session";
import type { Id } from "@/convex/_generated/dataModel";

function carDetailPath(slug: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  return `/cars/${slug}${searchParams.size ? `?${searchParams.toString()}` : ""}`;
}

function appendSearchParam(path: string, key: string, value: string) {
  return `${path}${path.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
}

function safeRedirectPath(value: FormDataEntryValue | null, fallback: string) {
  const path = String(value ?? "");

  if (path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }

  return fallback;
}

export async function requestBookingAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const sessionToken = await getSessionToken();
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");

  if (!sessionToken) {
    const nextParams = new URLSearchParams();

    if (startDate) {
      nextParams.set("startDate", startDate);
    }
    if (endDate) {
      nextParams.set("endDate", endDate);
    }

    const nextPath = carDetailPath(slug, Object.fromEntries(nextParams));
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  const startTime = Date.parse(startDate);
  const endTime = Date.parse(endDate);

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
    redirect(carDetailPath(slug, { bookingError: "dates", startDate, endDate }));
  }

  try {
    await getConvexClient().mutation(api.bookings.requestBooking, {
      sessionToken,
      vehicleId: String(formData.get("vehicleId")) as Id<"vehicles">,
      startDate,
      endDate,
    });
  } catch {
    redirect(carDetailPath(slug, { bookingError: "unavailable", startDate, endDate }));
  }

  revalidatePath("/trips");
  revalidatePath("/owner/dashboard");
  redirect("/trips?created=1");
}

export async function payBookingAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/trips");
  }

  try {
    await getConvexClient().mutation(api.bookings.renterPay, {
      sessionToken,
      bookingId: String(formData.get("bookingId")) as Id<"bookings">,
    });
  } catch {
    redirect("/trips?error=payment");
  }

  revalidatePath("/trips");
  revalidatePath("/owner/dashboard");
  redirect("/trips?paid=1");
}

export async function cancelBookingAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/trips");
  }

  try {
    await getConvexClient().mutation(api.bookings.renterCancel, {
      sessionToken,
      bookingId: String(formData.get("bookingId")) as Id<"bookings">,
    });
  } catch {
    redirect("/trips?error=cancel");
  }

  revalidatePath("/trips");
  revalidatePath("/owner/dashboard");
  redirect("/trips?cancelled=1");
}

export async function ownerBookingStatusAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/owner/dashboard");
  }

  const status = String(formData.get("status")) as "approved" | "active" | "completed" | "cancelled" | "disputed";

  try {
    await getConvexClient().mutation(api.bookings.ownerUpdateStatus, {
      sessionToken,
      bookingId: String(formData.get("bookingId")) as Id<"bookings">,
      status,
    });
  } catch {
    redirect("/owner/dashboard?bookingError=transition");
  }

  revalidatePath("/owner/dashboard");
  revalidatePath("/trips");
  redirect(`/owner/dashboard?bookingUpdated=${status}`);
}

export async function rateBookingAction(formData: FormData) {
  const sessionToken = await getSessionToken();
  const slug = String(formData.get("slug") ?? "");
  const fallbackPath = slug ? `/cars/${slug}` : "/trips";
  const redirectTo = safeRedirectPath(formData.get("redirectTo"), fallbackPath);

  if (!sessionToken) {
    redirect(`/sign-in?next=${encodeURIComponent(redirectTo)}`);
  }

  const rating = Number(formData.get("rating"));

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    redirect(appendSearchParam(redirectTo, "ratingError", "invalid"));
  }

  try {
    await getConvexClient().mutation(api.ratings.rateBooking, {
      sessionToken,
      bookingId: String(formData.get("bookingId")) as Id<"bookings">,
      rating,
      note: String(formData.get("note") ?? ""),
    });
  } catch {
    redirect(appendSearchParam(redirectTo, "ratingError", "failed"));
  }

  revalidatePath("/trips");
  if (slug) {
    revalidatePath(`/cars/${slug}`);
  }
  redirect(appendSearchParam(redirectTo, "rated", "1"));
}
