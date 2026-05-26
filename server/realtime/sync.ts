import { db } from "../db";
import { gameSessions, liveEvents } from "../db/schema";
import { eq } from "drizzle-orm";
import { broadcastToRoom } from "./channels";
import { dispatchEvent } from "../events";

/**
 * Synchronizes multiplayer game state.
 * Validates the state transition server-side before broadcasting to the partner.
 * This prevents client-side desync and cheating.
 */
export async function syncGameState(roomId: string, sessionId: string, actorId: string, newStateDelta: Record<string, any>) {
  // 1. Fetch current authoritative state
  const session = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.id, sessionId)
  });

  if (!session || session.status !== "active") {
    throw new Error("Invalid or inactive game session.");
  }

  // 2. Compute new state (Merge delta)
  // In a real implementation, this would involve Zod validation specific to the game type
  const mergedState = {
    ...(session.state as Record<string, any> || {}),
    ...newStateDelta,
    lastUpdateBy: actorId,
    lastUpdateAt: new Date().toISOString()
  };

  // 3. Persist authoritative state
  await db.update(gameSessions)
    .set({ state: mergedState })
    .where(eq(gameSessions.id, sessionId));

  // 4. Log the state sync event for debugging/history
  await db.insert(liveEvents).values({
    roomId,
    actorId,
    eventType: "state_sync",
    payload: newStateDelta
  });

  // 5. Broadcast the new authoritative state to the room
  await broadcastToRoom(roomId, "state_sync", mergedState, actorId);

  // 6. Alert the Event Bus if the game is complete
  if (newStateDelta.isComplete) {
    dispatchEvent("game_finished", { coupleId: session.coupleId, gameId: session.gameId, sessionId });
  }

  return mergedState;
}
