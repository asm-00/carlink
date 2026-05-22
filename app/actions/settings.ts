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
  redirect("/settings?saved=1");
}
