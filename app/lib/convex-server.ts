import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

let convexClient: ConvexHttpClient | null = null;

export function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }

  if (!convexClient) {
    convexClient = new ConvexHttpClient(url);
  }

  return convexClient;
}

export { api };
