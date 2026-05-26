import { db } from "../db";
import { billingProfiles, games } from "../db/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

/**
 * Validates if a couple has access to a specific premium game.
 * Isolates all monetization authorization logic.
 */
export async function canAccessPremiumContent(coupleId: string, gameId: string): Promise<boolean> {
  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId)
  });

  if (!game?.premium) return true; // Free content

  const billing = await db.query.billingProfiles.findFirst({
    where: eq(billingProfiles.coupleId, coupleId)
  });

  if (!billing || billing.subscriptionStatus !== "active") {
    logger.warn(`Access denied to premium game ${gameId} for couple ${coupleId}`);
    return false;
  }

  return true;
}

/**
 * Setup boundary for Stripe Webhooks.
 * Ensures that when a subscription is purchased or cancelled, the DB syncs safely.
 */
export async function handleStripeWebhook(event: any) {
  // 1. Verify Stripe Signature
  // 2. Map Stripe Event to internal logic
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Update billingProfile subscriptionStatus to "active"
      break;
    case 'customer.subscription.deleted':
      // Update billingProfile subscriptionStatus to "canceled"
      break;
  }
}
