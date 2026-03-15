import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { MembersTable } from "@/drizzle/schema";

export async function insertMember(
  { userId, name }: { userId?: string; name: string },
  householdId: string,
) {
  const [newMember] = await db
    .insert(MembersTable)
    .values({
      householdId,
      userId: userId ?? null,
      name,
    })
    .returning();

  if (newMember == null) throw new Error("Failed to create Member");

  return newMember;
}

export async function deleteMember(memberId: string, householdId: string) {
  const [deletedMember] = await db
    .delete(MembersTable)
    .where(
      and(
        eq(MembersTable.id, memberId),
        eq(MembersTable.householdId, householdId),
      ),
    )
    .returning();

  if (deletedMember == null) throw new Error("Failed to delete Member");

  return deletedMember;
}

export async function updateMember(
  { memberId, name }: { memberId: string; name: string },
  householdId: string,
) {
  const [updatedMember] = await db
    .update(MembersTable)
    .set({ name: name })
    .where(
      and(
        eq(MembersTable.id, memberId),
        eq(MembersTable.householdId, householdId),
      ),
    )
    .returning();

  if (updatedMember == null) throw new Error("Failed to update Member");

  return updatedMember;
}
