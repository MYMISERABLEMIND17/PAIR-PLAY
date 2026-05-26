import { db } from "../db";
import { backgroundJobs } from "../db/schema";
import { eq, and, lte } from "drizzle-orm";

type JobPayload = Record<string, any>;

/**
 * Enqueues a task to be processed asynchronously.
 * Prevents heavy calculations (like AI embedding or email dispatch) from blocking Realtime APIs.
 */
export async function enqueueJob(type: "process_memory" | "calculate_streak" | "generate_recap" | "send_notification", payload: JobPayload, delayMs: number = 0) {
  const runAt = new Date(Date.now() + delayMs);

  const [job] = await db.insert(backgroundJobs).values({
    type,
    payload,
    runAt
  }).returning();

  return job;
}

/**
 * A lightweight worker poll implementation.
 * In a production scale environment, this could be migrated to 
 * Inngest, Upstash Redis, or specialized Queue services.
 * We use PG-based jobs to maintain Startup Monolith simplicity.
 */
export async function processNextJob() {
  // 1. Fetch next available job
  const job = await db.query.backgroundJobs.findFirst({
    where: and(
      eq(backgroundJobs.status, "queued"),
      lte(backgroundJobs.runAt, new Date())
    ),
    orderBy: (jobs, { asc }) => [asc(jobs.runAt)]
  });

  if (!job) return null;

  // 2. Lock the job
  await db.update(backgroundJobs)
    .set({ status: "processing", updatedAt: new Date() })
    .where(eq(backgroundJobs.id, job.id));

  try {
    // 3. Process Based on Type
    switch (job.type) {
      case "process_memory":
        // await vectorizeMemory(...)
        break;
      // Handle other async job types here...
    }

    // 4. Mark Complete
    await db.update(backgroundJobs)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(backgroundJobs.id, job.id));
      
  } catch (err: any) {
    // 5. Handle Failure & Retries
    await db.update(backgroundJobs)
      .set({ 
        status: "failed", 
        errorLog: err.message,
        attempts: job.attempts + 1 
      })
      .where(eq(backgroundJobs.id, job.id));
  }

  return job;
}
