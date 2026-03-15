import { eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schema/user";

export async function updateUser(data: { name: string }, userId: string) {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();
  if (updatedUser == null) throw new Error("Failed to update User");

  return updatedUser;
}
