import { db } from "../db";
import { rateLimits } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Lightweight PostgreSQL-backed Rate Limiter.
 * Designed to protect AI endpoints, auth routes, and notification spam.
 * Once traffic exceeds a certain threshold, this boundary seamlessly migrates to Upstash Redis.
 */
export async function checkRateLimit(identifier: string, endpoint: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
  const compositeKey = `${identifier}:${endpoint}`;
  
  const record = await db.query.rateLimits.findFirst({
    where: eq(rateLimits.identifier, compositeKey)
  });

  const now = new Date();

  // If no record exists, or the window has reset, initialize it
  if (!record || record.resetAt < now) {
    await db.insert(rateLimits).values({
      identifier: compositeKey,
      endpoint,
      requests: 1,
      resetAt: new Date(now.getTime() + windowSeconds * 1000)
    }).onConflictDoUpdate({
      target: rateLimits.identifier,
      set: {
        requests: 1,
        resetAt: new Date(now.getTime() + windowSeconds * 1000)
      }
    });
    return true; // Allowed
  }

  // If the window is still active, check the request count
  if (record.requests >= maxRequests) {
    return false; // Blocked (Rate Limited)
  }

  // Increment the request count
  await db.update(rateLimits)
    .set({ requests: record.requests + 1 })
    .where(eq(rateLimits.identifier, compositeKey));

  return true; // Allowed
}
