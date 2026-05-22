import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export type SessionUser = Doc<"users">;

export async function getUserFromSession(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string,
): Promise<SessionUser | null> {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", sessionToken))
    .unique();

  if (!session || session.expiresAt <= Date.now()) {
    return null;
  }

  return await ctx.db.get(session.userId);
}

export async function requireUser(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string,
): Promise<SessionUser> {
  const user = await getUserFromSession(ctx, sessionToken);

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
}

export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string,
): Promise<SessionUser> {
  const user = await requireUser(ctx, sessionToken);

  if (user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireOwner(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string,
): Promise<SessionUser> {
  const user = await requireUser(ctx, sessionToken);

  if (user.role !== "owner" && user.role !== "admin") {
    throw new Error("Owner approval required");
  }

  return user;
}
