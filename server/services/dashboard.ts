import { db } from "../db";
import { activities, gameSessions } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../auth";
import { getActiveCouple } from "./couples";

/**
 * Aggregates personalized data for the main dashboard.
 * Designed to minimize frontend waterfall requests.
 */
export async function getDashboardData() {
  const { user } = await requireAuth();
  const couple = await getActiveCouple();

  if (!couple) {
    return {
      status: "no_couple",
      user,
    };
  }

  // 1. Fetch recent activity timeline
  const recentActivities = await db.query.activities.findMany({
    where: eq(activities.coupleId, couple.coupleId),
    orderBy: [desc(activities.createdAt)],
    limit: 5,
    with: { actor: true }
  });

  // 2. Check for an active game session
  const activeSession = await db.query.gameSessions.findFirst({
    where: eq(gameSessions.coupleId, couple.coupleId),
    orderBy: [desc(gameSessions.startedAt)],
    with: { game: true }
  });

  return {
    status: "active",
    user,
    partner: couple.partner,
    streakDays: couple.streakDays,
    recentActivities,
    activeSession: activeSession?.status === "active" ? activeSession : null,
  };
}
