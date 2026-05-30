import { db } from "../db";
import { savedMoments, activities, couples } from "../db/schema";
import { dispatchEvent } from "../events";
import { eq } from "drizzle-orm";

interface SaveMomentParams {
  relationshipId: string;
  sessionId?: string;
  roomId: string;
  gameId: string;
  promptText: string;
  answerA: string;
  answerB: string;
  savedBy: string;
}

/**
 * Persists a memorable shared answer pair as a saved moment.
 */
export async function saveMoment(params: SaveMomentParams) {
  const [moment] = await db.insert(savedMoments).values({
    relationshipId: params.relationshipId,
    sessionId: params.sessionId || null,
    roomId: params.roomId,
    gameId: params.gameId,
    promptText: params.promptText,
    answerA: params.answerA,
    answerB: params.answerB,
    savedBy: params.savedBy
  }).returning();

  try {
    // 1. Insert into activities feed
    await db.insert(activities).values({
      coupleId: params.relationshipId,
      actorId: params.savedBy,
      type: "memory_saved",
      metadata: {
        momentId: moment.id,
        promptText: params.promptText
      }
    });

    // 2. Update the couple's last interaction timestamp
    await db.update(couples)
      .set({ lastInteractionAt: new Date() })
      .where(eq(couples.id, params.relationshipId));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[Activities] Error recording saved moment activity: ${message}`);
  }

  // Dispatch event for social graph / progression milestones
  dispatchEvent("moment_saved", {
    momentId: moment.id,
    relationshipId: moment.relationshipId,
    savedBy: moment.savedBy
  });

  return moment;
}
