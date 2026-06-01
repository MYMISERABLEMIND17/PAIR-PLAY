import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { gameSessions, games, coupleMembers } from "../../../../server/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "../../../../server/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requestUserId = user.id;

    const sessionId = params.id;
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const session = await db
      .select({
        id: gameSessions.id,
        coupleId: gameSessions.coupleId,
        gameId: gameSessions.gameId,
        gameTitle: games.title,
        status: gameSessions.status,
        state: gameSessions.state,
        startedAt: gameSessions.startedAt,
        completedAt: gameSessions.completedAt,
      })
      .from(gameSessions)
      .leftJoin(games, eq(gameSessions.gameId, games.id))
      .where(eq(gameSessions.id, sessionId))
      .limit(1);

    if (!session || session.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const s = session[0];

    // Security: Validate user belongs to the relationship that owns this session
    const membership = await db
      .select()
      .from(coupleMembers)
      .where(
        and(
          eq(coupleMembers.coupleId, s.coupleId),
          eq(coupleMembers.userId, requestUserId)
        )
      )
      .limit(1);

    if (membership.length === 0) {
      console.warn(`[Security] Unauthorized session read attempt by ${requestUserId} on session ${sessionId}`);
      return NextResponse.json({ error: "Forbidden: You are not part of the relationship that owns this session" }, { status: 403 });
    }

    const durationMs = s.completedAt && s.startedAt 
      ? new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime() 
      : null;

    return NextResponse.json({
      ...s,
      durationMs,
      playerCount: 2 // By design Winkd is 2-player couples game
    });
  } catch (error: any) {
    console.error("[API] Error fetching session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
