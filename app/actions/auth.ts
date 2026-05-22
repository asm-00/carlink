"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { DEFAULT_ACCOUNT_PATH, isAdminPath, sanitizeRedirectPath } from "@/app/lib/redirects";
import { SESSION_COOKIE } from "@/app/lib/session";

function signInRedirect(nextPath: string, error: "missing" | "admin") {
  const params = new URLSearchParams({
    next: nextPath,
    error,
  });

  if (isAdminPath(nextPath)) {
    params.set("mode", "admin");
  }

  redirect(`/sign-in?${params.toString()}`);
}

export async function signInAction(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const nextPath = sanitizeRedirectPath(formData.get("next"), DEFAULT_ACCOUNT_PATH);

  if (!fullName || !email) {
    signInRedirect(nextPath, "missing");
  }

  const result = await getConvexClient().mutation(api.auth.signIn, {
    fullName,
    email,
  });

  if (isAdminPath(nextPath) && result.user.role !== "admin") {
    signInRedirect(nextPath, "admin");
  }

  (await cookies()).set(SESSION_COOKIE, result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(nextPath);
}

export async function signOutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
