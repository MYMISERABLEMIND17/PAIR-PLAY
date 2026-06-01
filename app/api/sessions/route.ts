import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../server/db";
import { gameSessions, coupleMembers, games } from "../../../server/db/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from "../../../server/auth";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    const { searchParams } = new URL(req.url);
    // Optionally allow querying for a specific user if admin, but default to self
    const targetUserId = searchParams.get("userId") || userId;
    
    // Auth validation: You can only query your own sessions (unless admin, but skipping for now)
    if (targetUserId !== userId) {
      console.warn(`[Security] User ${userId} attempted to read sessions for ${targetUserId}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Find couple(s) this user is part of
    const couples = await db
      .select({ coupleId: coupleMembers.coupleId })
      .from(coupleMembers)
      .where(eq(coupleMembers.userId, userId));

    if (couples.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    const coupleIds = couples.map(c => c.coupleId);

    // List recent sessions for these couples
    let allSessions: any[] = [];
    
    for (const cid of coupleIds) {
      const coupleSessions = await db
        .select({
          id: gameSessions.id,
          status: gameSessions.status,
          startedAt: gameSessions.startedAt,
          gameTitle: games.title,
        })
        .from(gameSessions)
        .leftJoin(games, eq(gameSessions.gameId, games.id))
        .where(eq(gameSessions.coupleId, cid))
        .orderBy(desc(gameSessions.startedAt))
        .limit(20);
        
      allSessions = [...allSessions, ...coupleSessions];
    }

    return NextResponse.json({
      sessions: allSessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    });
  } catch (error: any) {
    console.error("[API] Error listing sessions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
