import { db } from "../db";
import { presenceLog } from "../db/schema";
import { broadcastToRoom } from "./channels";

/**
 * Logs a user's presence state into the database for historical analytics (e.g. streaks, activity).
 * Note: Realtime ephemeral presence is handled directly by Supabase on the client,
 * this function is used to capture milestones and state changes durably.
 */
export async function updatePresenceState(userId: string, roomId: string, status: "online" | "idle" | "offline" | "in_game") {
  
  // 1. Log the state change durably
  await db.insert(presenceLog).values({
    userId,
    roomId,
    status
  });

  // 2. Broadcast to the room so the partner's UI updates instantly
  // Even though Supabase Presence does this natively, this ensures backend-validated state syncs
  await broadcastToRoom(roomId, "player_joined", { status, userId }, userId);

  return status;
}

/**
 * Handles graceful disconnects when a client drops off unexpectedly.
 */
export async function handleDisconnect(userId: string, roomId: string) {
  await updatePresenceState(userId, roomId, "offline");
}
