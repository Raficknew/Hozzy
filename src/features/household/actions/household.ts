"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { z } from "zod";
import {
  deleteHousehold as deleteHouseholdDB,
  insertHousehold,
  updateHousehold as updateHouseholdDB,
  updateLink,
} from "@/features/household/db/household";
import {
  type HouseholdSchema,
  householdSchema,
} from "@/features/household/schema/household";
import { insertMember } from "@/features/members/db/members";
import { auth } from "@/lib/auth";
import { assertHouseholdCreateAbility } from "../permissions/household";

export async function createHousehold(
  unsafeData: z.infer<typeof householdSchema>,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  const { success, data } = householdSchema.safeParse(unsafeData);

  if (!success) return { error: true, message: t("Household.createError") };

  await assertHouseholdCreateAbility(session.user.id);

  const household = await insertHousehold(
    {
      ...data,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      description: data.description !== "" ? data.description : null,
      ownerId: session?.user.id,
    },
    data.balance,
  );

  redirect(`/${household.id}/settings/household`);
}

export async function updateHousehold(
  unsafeData: HouseholdSchema,
  householdId: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  const { success, data } = householdSchema.safeParse(unsafeData);

  if (!success) return { error: true, message: t("Household.updateError") };

  await updateHouseholdDB(data, householdId);

  revalidatePath(`/${householdId}/settings/household`);
  return { error: false, message: t("Household.updateSuccess") };
}

export async function deleteHousehold(householdId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  await deleteHouseholdDB(householdId);

  redirect(`/`);
}

export async function joinHousehold(householdId: string, userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null || session.user.name == null) {
    return { error: true, message: t("User.invalidId") };
  }

  await insertMember({ userId, name: session.user.name }, householdId);

  redirect(`/${householdId}`);
}

export async function generateLinkForHousehold(
  householdId: string,
  link: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null) {
    return { error: true, message: t("User.invalidId") };
  }

  await updateLink(householdId, link);

  revalidatePath(`/${householdId}/settings/household`);

  return { error: false, message: t("Household.linkUpdated") };
}
