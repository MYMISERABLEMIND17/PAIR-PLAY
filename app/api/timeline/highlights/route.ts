import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { coupleMembers } from "../../../../server/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "../../../../server/auth";
import { getTimelineHighlights } from "../../../../server/services/timelineService";

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
      console.warn(`[Security] Unauthorized highlights read attempt by ${requestUserId} on couple ${coupleId}`);
      return NextResponse.json({ error: "Forbidden: Not part of this relationship" }, { status: 403 });
    }

    const highlights = await getTimelineHighlights(coupleId);

    return NextResponse.json({ highlights });
  } catch (error: any) {
    console.error("[API] Error fetching highlights:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
