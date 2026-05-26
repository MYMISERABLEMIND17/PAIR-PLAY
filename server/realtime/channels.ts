import { realtimeAdmin } from "./index";

/**
 * Types of events that can be broadcasted via Realtime Channels
 */
export type RealtimeEventType = 
  | "reaction_sent"
  | "player_joined"
  | "game_progressed"
  | "answer_revealed"
  | "typing_started"
  | "typing_stopped"
  | "state_sync";

export interface RealtimePayload {
  actorId: string;
  eventType: RealtimeEventType;
  data: Record<string, any>;
  timestamp: string;
}

/**
 * Generates a deterministic channel name for a specific room.
 */
export const getRoomChannelName = (roomId: string) => `room:${roomId}`;

/**
 * Server-side broadcast helper.
 * Uses the service role key to bypass RLS and push authoritative events to the clients.
 */
export async function broadcastToRoom(roomId: string, eventType: RealtimeEventType, data: Record<string, any>, actorId: string = "system") {
  const channelName = getRoomChannelName(roomId);
  const channel = realtimeAdmin.channel(channelName);
  
  const payload: RealtimePayload = {
    actorId,
    eventType,
    data,
    timestamp: new Date().toISOString()
  };

  await channel.send({
    type: "broadcast",
    event: eventType,
    payload
  });
}
