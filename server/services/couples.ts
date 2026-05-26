import { db } from "../db";
import { couples, coupleMembers } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../auth";

/**
 * Invites a partner to a new couple relationship.
 * Generates the 'pending' relationship record.
 */
export async function createCoupleInvite() {
  const { user } = await requireAuth();

  // 1. Create the couple record
  const [newCouple] = await db.insert(couples).values({
    status: "pending",
  }).returning();

  // 2. Link the initiator
  await db.insert(coupleMembers).values({
    coupleId: newCouple.id,
    userId: user.id,
    role: "initiator"
  });

  return newCouple;
}

/**
 * Accepts an invite to join a couple relationship.
 */
export async function joinCouple(coupleId: string) {
  const { user } = await requireAuth();

  // 1. Link the partner
  await db.insert(coupleMembers).values({
    coupleId,
    userId: user.id,
    role: "partner"
  });

  // 2. Upgrade the couple status to active
  const [activeCouple] = await db.update(couples)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(couples.id, coupleId))
    .returning();

  return activeCouple;
}

/**
 * Retrieves the user's active couple relationship details.
 */
export async function getActiveCouple() {
  const { user } = await requireAuth();

  // Find membership
  const membership = await db.query.coupleMembers.findFirst({
    where: eq(coupleMembers.userId, user.id),
    with: {
      couple: {
        with: {
          members: {
            with: {
              user: true
            }
          }
        }
      }
    }
  });

  if (!membership || membership.couple.status !== "active") {
    return null;
  }

  // Find the partner specifically
  const partner = membership.couple.members.find(m => m.userId !== user.id)?.user;

  return {
    coupleId: membership.couple.id,
    streakDays: membership.couple.streakDays,
    partner,
    role: membership.role
  };
}
