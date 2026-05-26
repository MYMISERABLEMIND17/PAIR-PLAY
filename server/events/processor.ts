import { dispatchEvent } from "./index";
import { enqueueJob } from "../jobs";

/**
 * Event Processing Pipeline.
 * 
 * Subscribes to critical backend events and routes them to asynchronous processing queues.
 * This ensures that when an event occurs (e.g., a memory is created via UI), the UI does 
 * not hang while waiting for OpenAI embeddings or massive analytical queries to run.
 */

export function attachAsyncProcessors(eventBus: any) {
  
  // Example: When a game finishes, we want to update the relationship analytics
  // and possibly extract semantic memories from the answers.
  eventBus.on("game_finished", async (payload: { coupleId: string, gameId: string, sessionId: string }) => {
    
    console.log(`[Event Pipeline] Routing game_finished for async processing...`);
    
    // Offload heavy processing to the background job queue
    await enqueueJob("generate_recap", { 
      coupleId: payload.coupleId, 
      sessionId: payload.sessionId 
    });
    
  });

  // Example: When a milestone is reached, offload the notification dispatch
  eventBus.on("milestone_unlocked", async (payload: { coupleId: string, type: string, value: number }) => {
    
    // Add a 5 second delay to the push notification to feel more organic
    await enqueueJob("send_notification", payload, 5000);
    
  });
}
