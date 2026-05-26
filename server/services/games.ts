import { db } from "../db";
import { gameSessions } from "../db/schema";
import { eq } from "drizzle-orm";
import { getActiveCouple } from "./couples";
import { dispatchEvent } from "../events";

/**
 * Initializes a new multiplayer game session.
 */
export async function startGameSession(gameId: string) {
  const couple = await getActiveCouple();
  if (!couple) throw new Error("Must be in an active couple to play.");

  // Create the session
  const [session] = await db.insert(gameSessions).values({
    coupleId: couple.coupleId,
    gameId,
    state: { turn: 1, history: [] } // Base state seed
  }).returning();

  // Alert the architecture that a game started
  dispatchEvent("game_started", { coupleId: couple.coupleId, gameId, sessionId: session.id });

  return session;
}

/**
 * Completes a session and fires progression logic.
 */
export async function finishGameSession(sessionId: string) {
  const [session] = await db.update(gameSessions)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(gameSessions.id, sessionId))
    .returning();

  if (session) {
    dispatchEvent("game_finished", { coupleId: session.coupleId, gameId: session.gameId, sessionId });
  }

  return session;
}
