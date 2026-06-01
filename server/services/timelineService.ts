import { db } from "../db";
import { activities, savedMoments } from "../db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface TimelineEventInput {
  coupleId: string;
  actorId: string;
  type: "game_played" | "milestone_reached" | "memory_saved" | "challenge_completed";
  metadata: Record<string, any>;
}

export async function createTimelineEvent(input: TimelineEventInput) {
  const [event] = await db.insert(activities).values({
    coupleId: input.coupleId,
    actorId: input.actorId,
    type: input.type,
    metadata: input.metadata
  }).returning();
  return event;
}

export async function getTimeline(coupleId: string, limit: number = 20, cursor?: string) {
  // Simple pagination based on cursor (which would be the id or createdAt)
  // For simplicity, using limit/offset or just limit for now.
  // In production, keyset pagination (cursor based on createdAt) is required.

  const baseQuery = db
    .select()
    .from(activities)
    .where(eq(activities.coupleId, coupleId))
    .orderBy(desc(activities.createdAt));
    
  // If cursor was provided, we would add: .where(lt(activities.createdAt, new Date(cursor)))
  
  const events = await baseQuery.limit(limit);

  // Hydrate memory_saved events with actual moment text if needed
  // Alternatively, the metadata already contains `promptText` as saved in `moments.ts`
  
  return events;
}

export async function getTimelineHighlights(coupleId: string) {
  // Highlights are just the most emotionally resonant events: e.g., milestones and memory_saved.
  const highlights = await db
    .select()
    .from(activities)
    .where(
      and(
        eq(activities.coupleId, coupleId),
        inArray(activities.type, ["memory_saved", "milestone_reached"])
      )
    )
    .orderBy(desc(activities.createdAt))
    .limit(10);
    
  return highlights;
}
