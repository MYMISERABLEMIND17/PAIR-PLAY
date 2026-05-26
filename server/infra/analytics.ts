import { db } from "../db";
import { analyticsEvents } from "../db/schema";

/**
 * Server-Side Analytics Tracking.
 * Ensures critical engagement metrics (retention funnels, game completion rates) 
 * are tracked securely on the backend, bypassing ad-blockers and frontend fragility.
 */
export async function trackEvent(userId: string | null, eventName: string, properties: Record<string, any> = {}) {
  
  // Asynchronously insert into Postgres. 
  // In a mature stage, this will also fire to PostHog or Segment.
  db.insert(analyticsEvents).values({
    userId: userId || undefined, // Allow anonymous events if needed
    event: eventName,
    properties
  }).catch(err => {
    // Analytics failure must never break the app
    console.error(`Analytics failure for event ${eventName}:`, err);
  });

}
