import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserFromSession, requireUser } from "./lib/session";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function makeSessionToken() {
  return crypto.randomUUID() + ":" + crypto.randomUUID();
}

export const signIn = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const email = normalizeEmail(args.email);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const role = existing?.role ?? "renter";
    const ownerStatus = existing?.ownerStatus ?? "none";

    const userId = existing
      ? existing._id
      : await ctx.db.insert("users", {
          fullName: args.fullName.trim(),
          email,
          role,
          ownerStatus,
          isVerified: false,
          createdAt: now,
          updatedAt: now,
        });

    if (existing) {
      await ctx.db.patch(existing._id, {
        fullName: args.fullName.trim() || existing.fullName,
        role,
        updatedAt: now,
      });
    }

    const token = makeSessionToken();
    await ctx.db.insert("sessions", {
      token,
      userId,
      createdAt: now,
      expiresAt: now + 1000 * 60 * 60 * 24 * 30,
    });

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Could not create user");
    }

    return {
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        ownerStatus: user.ownerStatus,
      },
    };
  },
});

export const currentUser = query({
  args: {
    sessionToken: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    if (!args.sessionToken) {
      return null;
    }

    const user = await getUserFromSession(ctx, args.sessionToken);
    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      ownerStatus: user.ownerStatus,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
});

export const updateProfile = mutation({
  args: {
    sessionToken: v.string(),
    fullName: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx, args.sessionToken);
    const fullName = args.fullName.trim();
    const phone = args.phone.trim();

    if (!fullName) {
      throw new Error("Full name is required");
    }

    const now = Date.now();
    await ctx.db.patch(user._id, {
      fullName,
      phone,
      updatedAt: now,
    });

    const application = await ctx.db
      .query("ownerApplications")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (application) {
      await ctx.db.patch(application._id, {
        fullName,
        phone,
        updatedAt: now,
      });
    }

    const updatedUser = await ctx.db.get(user._id);
    if (!updatedUser) {
      throw new Error("Could not update user");
    }

    return {
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      ownerStatus: updatedUser.ownerStatus,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  },
});
