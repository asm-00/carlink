export const DEFAULT_ACCOUNT_PATH = "/settings";

export function isAdminPath(path: string) {
  return path === "/admin" || path.startsWith("/admin/");
}

export function sanitizeRedirectPath(value: unknown, fallback = DEFAULT_ACCOUNT_PATH) {
  if (typeof value !== "string") {
    return fallback;
  }

  const path = value.trim();

  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path === "/sign-in" ||
    path.startsWith("/sign-in?") ||
    path.includes("\n") ||
    path.includes("\r")
  ) {
    return fallback;
  }

  return path;
}

export function signInPath(nextPath = DEFAULT_ACCOUNT_PATH) {
  const safeNextPath = sanitizeRedirectPath(nextPath);
  return `/sign-in?next=${encodeURIComponent(safeNextPath)}`;
}
