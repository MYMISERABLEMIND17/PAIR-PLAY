import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { savedMoments, coupleMembers } from "../../../../server/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "../../../../server/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.warn("[Security] Unauthorized attempt to DELETE /api/moments/[id]");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requestUserId = user.id;

    const momentId = params.id;

    if (!momentId) {
      return NextResponse.json({ error: "Moment ID required" }, { status: 400 });
    }

    // 1. Fetch the moment to check ownership
    const momentList = await db
      .select()
      .from(savedMoments)
      .where(eq(savedMoments.id, momentId))
      .limit(1);

    if (momentList.length === 0) {
      return NextResponse.json({ error: "Moment not found" }, { status: 404 });
    }

    const moment = momentList[0];

    // 2. Security: Verify the user is a member of the relationship that owns this moment
    // (We allow either partner to delete the moment - "Hybrid Ownership Model")
    const membership = await db
      .select()
      .from(coupleMembers)
      .where(
        and(
          eq(coupleMembers.coupleId, moment.relationshipId),
          eq(coupleMembers.userId, requestUserId)
        )
      )
      .limit(1);

    if (membership.length === 0) {
      console.warn(`[Security] Unauthorized deletion attempt by ${requestUserId} on couple ${moment.relationshipId}`);
      return NextResponse.json({ error: "Forbidden: You cannot delete this moment" }, { status: 403 });
    }

    // 3. Delete
    await db.delete(savedMoments).where(eq(savedMoments.id, momentId));

    return NextResponse.json({ success: true, message: "Moment deleted" });
  } catch (error: any) {
    console.error("[API] Error deleting moment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
