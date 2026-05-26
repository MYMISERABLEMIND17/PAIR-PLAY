import { z } from "zod";

// =======================
// AUTH VALIDATION
// =======================
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = loginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
});

// =======================
// USER PROFILE VALIDATION
// =======================
export const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).optional(),
  bio: z.string().max(160, "Bio is too long").optional(),
  timezone: z.string().optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional(),
});

// =======================
// COUPLE SYSTEM VALIDATION
// =======================
export const createCoupleSchema = z.object({
  partnerEmail: z.string().email("Invalid partner email address"),
});

export const respondToInviteSchema = z.object({
  coupleId: z.string().uuid("Invalid couple ID"),
  accept: z.boolean(),
});

// =======================
// ACTIVITY VALIDATION
// =======================
export const trackActivitySchema = z.object({
  coupleId: z.string().uuid(),
  type: z.enum(["game_played", "milestone_reached", "reaction_sent", "memory_saved", "challenge_completed"]),
  metadata: z.record(z.string(), z.any()).optional(),
});
