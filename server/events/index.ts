import { EventEmitter } from "events";
import { evaluateStreak } from "../services/streaks";
import { broadcastToCouple } from "../realtime";

/**
 * Centralized Event-Driven Architecture for the Backend.
 * Decouples logic so starting a game automatically triggers streaks,
 * notifications, and analytics without polluting the specific service.
 */
class BackendEventBus extends EventEmitter {}
const eventBus = new BackendEventBus();

export type AppEvent = "game_started" | "game_finished" | "milestone_unlocked" | "partner_joined" | "moment_saved";

/**
 * Type-safe dispatcher for backend events.
 */
export function dispatchEvent(event: AppEvent, payload: any) {
  eventBus.emit(event, payload);
}

// ==========================================
// EVENT LISTENERS (The "Glue" of the system)
// ==========================================

eventBus.on("game_started", async (payload: { coupleId: string, gameId: string, sessionId: string }) => {
  console.log(`[Event: game_started] Couple: ${payload.coupleId}`);
  // Broadcast to partner via realtime
  await broadcastToCouple(payload.coupleId, "game_started", { sessionId: payload.sessionId });
  // Evaluate if this action restores a streak
  await evaluateStreak(payload.coupleId);
});

eventBus.on("game_finished", async (payload: { coupleId: string, gameId: string, sessionId: string }) => {
  console.log(`[Event: game_finished] Session: ${payload.sessionId}`);
  // In a real app, this might trigger XP allocation or memory curation here
});

eventBus.on("milestone_unlocked", async (payload: { coupleId: string, type: string, value: number }) => {
  // Push notification logic could live here
});
