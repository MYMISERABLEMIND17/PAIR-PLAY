import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../server/db";
import { savedMoments, couples, coupleMembers } from "../../../server/db/schema";
import { eq, and } from "drizzle-orm";
import { saveMoment } from "../../../server/services/moments";
import { createClient } from "../../../server/auth";

// GET /api/moments?relationshipId=123
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requestUserId = user.id;

    const { searchParams } = new URL(req.url);
    const relationshipId = searchParams.get("relationshipId");
    
    if (!relationshipId) {
      return NextResponse.json({ error: "relationshipId is required" }, { status: 400 });
    }

    // Security: Validate user belongs to this relationship
    const membership = await db
      .select()
      .from(coupleMembers)
      .where(
        and(
          eq(coupleMembers.coupleId, relationshipId),
          eq(coupleMembers.userId, requestUserId)
        )
      )
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: "Forbidden: Not part of this relationship" }, { status: 403 });
    }

    const moments = await db
      .select()
      .from(savedMoments)
      .where(eq(savedMoments.relationshipId, relationshipId))
      .orderBy(savedMoments.createdAt); // Needs descending usually, handled below

    return NextResponse.json({
      moments: moments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
  } catch (error: any) {
    console.error("[API] Error fetching moments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/moments
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.warn("[Security] Unauthorized attempt to POST /api/moments");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requestUserId = user.id;

    const body = await req.json();
    const { relationshipId, sessionId, roomId, gameId, promptText, answerA, answerB, savedBy } = body;
    
    if (!relationshipId || !promptText || !savedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (requestUserId !== savedBy) {
      console.warn(`[Security] Spoofing attempt blocked. User ${requestUserId} tried to save as ${savedBy}`);
      return NextResponse.json({ error: "Forbidden: Cannot save on behalf of another user" }, { status: 403 });
    }

    // Security: Validate user belongs to this relationship
    const membership = await db
      .select()
      .from(coupleMembers)
      .where(
        and(
          eq(coupleMembers.coupleId, relationshipId),
          eq(coupleMembers.userId, requestUserId)
        )
      )
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: "Forbidden: Not part of this relationship" }, { status: 403 });
    }

    // Use the core service function which also updates activity feeds
    const moment = await saveMoment({
      relationshipId,
      sessionId,
      roomId,
      gameId,
      promptText,
      answerA,
      answerB,
      savedBy
    });

    return NextResponse.json({ moment }, { status: 201 });
  } catch (error: any) {
    console.error("[API] Error saving moment:", error);
    // Handle Drizzle unique constraint violations safely
    if (error.code === '23505' || error.message?.includes('unique constraint')) {
      return NextResponse.json({ error: "Moment already saved" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
