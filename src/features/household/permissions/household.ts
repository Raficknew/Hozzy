import { and, count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { validate as validateUuid } from "uuid";
import { db } from "@/drizzle";
import { HouseholdTable, MembersTable } from "@/drizzle/schema";
import { getHousehold } from "@/global/actions";
import { MAX_HOUSEHOLD_PER_USER } from "@/global/limits";
import { auth } from "@/lib/auth";

export async function assertHouseholdCreateAbility(userId: string) {
  if (!userId) throw "UserNotFound";

  const result = await db
    .select({ count: count() })
    .from(HouseholdTable)
    .where(eq(HouseholdTable.ownerId, userId));

  const householdsCount = result[0]?.count ?? 0;

  if (householdsCount < MAX_HOUSEHOLD_PER_USER) {
    return;
  }

  throw "YouReachedALimitOfHouseholds";
}

export async function assertHouseholdWriteAccess(
  householdId: string,
  userId?: string,
) {
  let currentUserId = userId;

  if (!currentUserId) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    currentUserId = session?.user?.id;
  }

  if (!currentUserId) {
    throw "UserNotFound";
  }

  if (!validateUuid(householdId)) {
    throw "HouseholdNotFound";
  }

  const household = await db.query.HouseholdTable.findFirst({
    where: eq(HouseholdTable.id, householdId),
    columns: { id: true, ownerId: true },
  });

  if (!household) {
    throw "HouseholdNotFound";
  }

  if (household.ownerId === currentUserId) {
    return;
  }

  const member = await db.query.MembersTable.findFirst({
    where: and(
      eq(MembersTable.householdId, householdId),
      eq(MembersTable.userId, currentUserId),
    ),
    columns: { id: true },
  });

  if (member) {
    return;
  }

  throw "NotAllowedToWriteHouseholdException";
}

export async function canAccessHouseholdSettings(householdId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const household = await getHousehold(householdId);

  if (user && user.id === household?.ownerId) {
    return true;
  }

  return false;
}
