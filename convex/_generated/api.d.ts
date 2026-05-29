/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as lib_platformStats from "../lib/platformStats.js";
import type * as lib_session from "../lib/session.js";
import type * as marketplace from "../marketplace.js";
import type * as ownerApplications from "../ownerApplications.js";
import type * as ownerDashboard from "../ownerDashboard.js";
import type * as ratings from "../ratings.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as vehicles from "../vehicles.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  bookings: typeof bookings;
  "lib/platformStats": typeof lib_platformStats;
  "lib/session": typeof lib_session;
  marketplace: typeof marketplace;
  ownerApplications: typeof ownerApplications;
  ownerDashboard: typeof ownerDashboard;
  ratings: typeof ratings;
  seed: typeof seed;
  settings: typeof settings;
  vehicles: typeof vehicles;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
