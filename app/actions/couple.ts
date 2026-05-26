"use server";

import { createClient } from "../../server/auth";
import { db } from "../../server/db";
import { couples, coupleMembers, users } from "../../server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function invitePartnerAction(formData: FormData) {
  const partnerEmail = formData.get("email") as string;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Check if partner exists in our system
  const partnerUser = await db.query.users.findFirst({
    where: eq(users.email, partnerEmail)
  });

  if (!partnerUser) {
    return { error: "Partner must create an account first." };
  }

  // 2. Create the Couple Entity
  const [couple] = await db.insert(couples).values({
    streakDays: 0
  }).returning();

  // 3. Link both users to the couple
  await db.insert(coupleMembers).values([
    { coupleId: couple.id, userId: user.id, role: "initiator" },
    { coupleId: couple.id, userId: partnerUser.id, role: "partner" }
  ]);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
