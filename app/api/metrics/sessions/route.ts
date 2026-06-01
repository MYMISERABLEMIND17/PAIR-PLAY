import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../server/db";
import { gameSessions } from "../../../../server/db/schema";
import { sql } from "drizzle-orm";
import { createClient } from "../../../../server/auth";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select({
        totalSessions: sql<number>`count(*)`,
        completedSessions: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`,
        abandonedSessions: sql<number>`sum(case when status = 'abandoned' then 1 else 0 end)`,
        avgDurationSeconds: sql<number>`avg(extract(epoch from (completed_at - started_at)))`
      })
      .from(gameSessions);

    const metrics = result[0];
    const total = Number(metrics.totalSessions) || 0;
    const completed = Number(metrics.completedSessions) || 0;
    const abandoned = Number(metrics.abandonedSessions) || 0;
    const avgDuration = Number(metrics.avgDurationSeconds) || 0;

    return NextResponse.json({
      totalSessions: total,
      completionRate: total > 0 ? (completed / total) : 0,
      abandonmentRate: total > 0 ? (abandoned / total) : 0,
      averageDurationSeconds: avgDuration
    });
  } catch (error: any) {
    console.error("[API] Error fetching session metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
