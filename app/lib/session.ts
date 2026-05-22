import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";

export const SESSION_COOKIE = "carlink_session";

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export const getCurrentUser = cache(async () => {
  const sessionToken = await getSessionToken();
  return await getConvexClient().query(api.auth.currentUser, { sessionToken });
});

export async function requireSignedIn(nextPath = "/trips") {
  const [sessionToken, user] = await Promise.all([getSessionToken(), getCurrentUser()]);

  if (!sessionToken || !user) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  return { sessionToken, user };
}

export async function requireAdmin() {
  const [sessionToken, user] = await Promise.all([getSessionToken(), getCurrentUser()]);

  if (!sessionToken || !user || user.role !== "admin") {
    redirect("/sign-in?next=/admin&mode=admin");
  }

  return { sessionToken, user };
}

export async function requireOwner() {
  const [sessionToken, user] = await Promise.all([getSessionToken(), getCurrentUser()]);

  if (!sessionToken || !user) {
    redirect("/sign-in?next=/owner/dashboard");
  }

  if (user.role !== "owner" && user.role !== "admin") {
    redirect("/owner");
  }

  return { sessionToken, user };
}
