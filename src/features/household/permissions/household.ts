import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/drizzle";
import { HouseholdTable } from "@/drizzle/schema";
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

export async function assertHouseholdWriteAccess(householdId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    throw "UserNotFound";
  }

  const household = await getHousehold(householdId);

  if (!household) {
    throw "HouseholdNotFound";
  }

  const isOwner = user && user.id === household?.ownerId;
  const isMember = user && household?.members.find((u) => u.userId === user.id);

  if (isOwner || isMember) {
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
