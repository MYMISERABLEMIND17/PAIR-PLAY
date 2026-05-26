import { db } from "../db";
import { liveEvents } from "../db/schema";
import { broadcastToRoom } from "./channels";

/**
 * Dispatches a live emotional reaction (e.g., ❤️, 🔥, 🌶️) into the room.
 * This is designed to be ultra-fast: it broadcasts immediately, and logs to the DB asynchronously.
 */
export async function sendLiveReaction(roomId: string, actorId: string, emoji: string) {
  
  const payload = { emoji, timestamp: Date.now() };

  // 1. IMMEDIATELY broadcast to ensure zero-latency UI feel
  await broadcastToRoom(roomId, "reaction_sent", payload, actorId);

  // 2. ASYNCHRONOUSLY log to the DB for relationship history / memory timeline
  // We do not await this to prevent blocking the UI
  db.insert(liveEvents).values({
    roomId,
    actorId,
    eventType: "reaction",
    payload
  }).catch(err => {
    console.error("Failed to log reaction event to history:", err);
  });

  return { success: true, payload };
}

/**
 * Dispatches ephemeral typing/thinking indicators.
 * We do not log these to the DB as they are purely ephemeral.
 */
export async function sendTypingIndicator(roomId: string, actorId: string, isTyping: boolean) {
  const event = isTyping ? "typing_started" : "typing_stopped";
  
  await broadcastToRoom(roomId, event, { isTyping }, actorId);
}
