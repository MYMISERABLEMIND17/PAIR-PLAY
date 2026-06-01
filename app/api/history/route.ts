import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../server/db";
import { gameSessions, games, coupleMembers } from "../../../server/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { createClient } from "../../../server/auth";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requestUserId = user.id;

    const { searchParams } = new URL(req.url);
    const coupleId = searchParams.get("coupleId");
    
    if (!coupleId) {
      return NextResponse.json({ error: "coupleId parameter is required" }, { status: 400 });
    }

    // Security: Validate user belongs to this relationship
    const membership = await db
      .select()
      .from(coupleMembers)
      .where(
        and(
          eq(coupleMembers.coupleId, coupleId),
          eq(coupleMembers.userId, requestUserId)
        )
      )
      .limit(1);

    if (membership.length === 0) {
      console.warn(`[Security] Unauthorized history read attempt by ${requestUserId} on couple ${coupleId}`);
      return NextResponse.json({ error: "Forbidden: Not part of this relationship" }, { status: 403 });
    }

    // Get all shared sessions in chronological order
    const history = await db
      .select({
        id: gameSessions.id,
        gameId: gameSessions.gameId,
        gameTitle: games.title,
        status: gameSessions.status,
        state: gameSessions.state,
        startedAt: gameSessions.startedAt,
        completedAt: gameSessions.completedAt,
      })
      .from(gameSessions)
      .leftJoin(games, eq(gameSessions.gameId, games.id))
      .where(eq(gameSessions.coupleId, coupleId))
      .orderBy(desc(gameSessions.startedAt));

    // Timeline-ready structure
    const timeline = history.map(session => ({
      eventId: session.id,
      eventType: "game_session",
      date: session.startedAt,
      details: {
        title: session.gameTitle || "Winkd Game",
        status: session.status,
        durationMs: session.completedAt && session.startedAt 
          ? new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()
          : null
      }
    }));

    return NextResponse.json({ timeline });
  } catch (error: any) {
    console.error("[API] Error fetching couple history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
