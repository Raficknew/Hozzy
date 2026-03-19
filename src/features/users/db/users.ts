import { eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { user } from "@/drizzle/schema/auth";

export async function updateUser(data: { name: string }, userId: string) {
  const [updatedUser] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, userId))
    .returning();
  if (updatedUser == null) throw new Error("Failed to update User");

  return updatedUser;
}
