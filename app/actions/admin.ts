"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { getSessionToken } from "@/app/lib/session";
import type { Id } from "@/convex/_generated/dataModel";

export async function approveOwnerAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/admin&mode=admin");
  }

  await getConvexClient().mutation(api.admin.approveOwner, {
    sessionToken,
    applicationId: String(formData.get("applicationId")) as Id<"ownerApplications">,
  });

  revalidatePath("/admin");
}

export async function approveVehicleAction(formData: FormData) {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    redirect("/sign-in?next=/admin&mode=admin");
  }

  await getConvexClient().mutation(api.vehicles.approveListing, {
    sessionToken,
    vehicleId: String(formData.get("vehicleId")) as Id<"vehicles">,
  });

  revalidatePath("/admin");
  revalidatePath("/");
}
