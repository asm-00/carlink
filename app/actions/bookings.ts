"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getSessionToken } from "@/app/lib/session";
import type { Id } from "@/convex/_generated/dataModel";

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

    const nextPath = `/cars/${slug}${nextParams.size ? `?${nextParams.toString()}` : ""}`;
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  const startTime = Date.parse(startDate);
  const endTime = Date.parse(endDate);

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
    const errorParams = new URLSearchParams({ bookingError: "dates" });

    if (startDate) {
      errorParams.set("startDate", startDate);
    }
    if (endDate) {
      errorParams.set("endDate", endDate);
    }

    redirect(`/cars/${slug}?${errorParams.toString()}`);
  }

  await getConvexClient().mutation(api.bookings.requestBooking, {
    sessionToken,
    vehicleId: String(formData.get("vehicleId")) as Id<"vehicles">,
    startDate,
    endDate,
  });

  revalidatePath("/trips");
  redirect("/trips?created=1");
}

export async function payBookingAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/trips");
  }

  await getConvexClient().mutation(api.bookings.renterPay, {
    sessionToken,
    bookingId: String(formData.get("bookingId")) as Id<"bookings">,
  });

  revalidatePath("/trips");
}

export async function ownerBookingStatusAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/owner/dashboard");
  }

  await getConvexClient().mutation(api.bookings.ownerUpdateStatus, {
    sessionToken,
    bookingId: String(formData.get("bookingId")) as Id<"bookings">,
    status: String(formData.get("status")) as "approved" | "active" | "completed" | "cancelled" | "disputed",
  });

  revalidatePath("/owner/dashboard");
}
