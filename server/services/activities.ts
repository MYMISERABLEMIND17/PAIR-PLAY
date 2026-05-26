import { db } from "../db";
import { activities, notifications, couples } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../auth";
import { trackActivitySchema } from "../validations";
import { getActiveCouple } from "./couples";

/**
 * Tracks an emotional or gaming event for a couple.
 * Automatically updates the couple's 'lastInteractionAt' timestamp.
 */
export async function trackActivity(data: any) {
  const { user } = await requireAuth();
  
  // Strict backend validation
  const validated = trackActivitySchema.parse(data);

  // 1. Insert the activity record
  const [activity] = await db.insert(activities).values({
    coupleId: validated.coupleId,
    actorId: user.id,
    type: validated.type,
    metadata: validated.metadata || {}
  }).returning();

  // 2. Update the couple's last interaction timestamp
  await db.update(couples)
    .set({ lastInteractionAt: new Date() })
    .where(eq(couples.id, validated.coupleId));

  return activity;
}

/**
 * Dispatches an internal notification to the partner.
 * Used for invites, reactions, or AI insights.
 */
export async function sendPartnerNotification(title: string, message: string, type: "system" | "partner_action" | "ai_insight", actionUrl?: string) {
  const { user } = await requireAuth();
  const couple = await getActiveCouple();

  if (!couple || !couple.partner) {
    throw new Error("No active partner found to notify.");
  }

  await db.insert(notifications).values({
    userId: couple.partner.id,
    title,
    message,
    type,
    actionUrl
  });
}
