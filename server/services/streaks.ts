import { db } from "../db";
import { couples } from "../db/schema";
import { eq } from "drizzle-orm";
import { getActiveCouple } from "./couples";
import { dispatchEvent } from "../events";

/**
 * Scalable engine to evaluate and increment couple streaks.
 * Called automatically by the Event Architecture when activities occur.
 */
export async function evaluateStreak(coupleId: string) {
  const coupleObj = await db.query.couples.findFirst({
    where: eq(couples.id, coupleId)
  });

  if (!coupleObj || coupleObj.status !== "active") return;

  const now = new Date();
  const lastInteraction = coupleObj.lastInteractionAt ? new Date(coupleObj.lastInteractionAt) : new Date(0);
  
  // Basic midnight logic (Should ideally use timezone of users in production)
  const isDifferentDay = now.toDateString() !== lastInteraction.toDateString();
  const diffInHours = Math.abs(now.getTime() - lastInteraction.getTime()) / 36e5;

  // If it's a new day and within the 48-hour grace period
  if (isDifferentDay && diffInHours <= 48) {
    const newStreak = coupleObj.streakDays + 1;
    
    await db.update(couples)
      .set({ 
        streakDays: newStreak,
        lastInteractionAt: now,
      })
      .where(eq(couples.id, coupleId));

    // Dispatch milestone event if applicable
    if ([7, 30, 100, 365].includes(newStreak)) {
      dispatchEvent("milestone_unlocked", { coupleId, type: "streak", value: newStreak });
    }
  } 
  // If the streak is completely broken (>48 hours)
  else if (diffInHours > 48) {
    await db.update(couples)
      .set({ streakDays: 1, lastInteractionAt: now })
      .where(eq(couples.id, coupleId));
  }
}
