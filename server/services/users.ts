import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../auth";
import { updateProfileSchema } from "../validations";

/**
 * Ensures a user record exists in the database.
 * Used during the signup flow or first login via OAuth.
 */
export async function syncUser(email: string, id: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, id)
  });

  if (!existingUser) {
    await db.insert(users).values({
      id,
      email,
      onboarded: false
    });
  }
}

/**
 * Updates the user's profile information.
 * Uses Zod validation to ensure data integrity.
 */
export async function updateUserProfile(data: any) {
  const { user } = await requireAuth();
  
  // Validate incoming data securely on the server
  const validated = updateProfileSchema.parse(data);

  const [updatedUser] = await db.update(users)
    .set({
      ...validated,
      updatedAt: new Date()
    })
    .where(eq(users.id, user.id))
    .returning();

  return updatedUser;
}

/**
 * Marks the user as fully onboarded.
 */
export async function completeOnboarding() {
  const { user } = await requireAuth();

  await db.update(users)
    .set({ onboarded: true })
    .where(eq(users.id, user.id));
}
