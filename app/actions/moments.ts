"use server";

import { db } from "../../server/db";
import { savedMoments } from "../../server/db/schema";
import { getActiveCouple } from "../../server/services/couples";
import { eq, desc } from "drizzle-orm";

/**
 * Server Action to securely retrieve all saved moments for the active couple relationship.
 * Resolves the active user session internally to prevent unauthorized cross-couple data leakage.
 */
export async function getSavedMomentsAction() {
  const activeCouple = await getActiveCouple();
  if (!activeCouple) {
    throw new Error("Must be in an active couple relationship to view moments.");
  }

  // Authoritatively query saved moments for the active relationship
  const moments = await db.query.savedMoments.findMany({
    where: eq(savedMoments.relationshipId, activeCouple.coupleId),
    orderBy: [desc(savedMoments.createdAt)],
  });

  return moments;
}
