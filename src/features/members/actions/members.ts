"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { validate as validateUuid } from "uuid";
import type { z } from "zod";
import {
  deleteMember as deleteMemberDB,
  insertMember,
  updateMember as updateMemberDB,
} from "@/features/members/db/members";
import {
  assertMemberWriteAccess,
  checkIfUserCanCreateNewMember,
} from "@/features/members/permissions/members";
import { membersSchema } from "@/features/members/schema/members";
import { auth } from "@/lib/auth";

export async function createMember(
  unsafeData: z.infer<typeof membersSchema>,
  householdId: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  await assertMemberWriteAccess(householdId);

  if (!(await checkIfUserCanCreateNewMember(householdId)))
    return { error: true, message: t("Limits.memberLimitReached") };

  const { data, success } = membersSchema.safeParse(unsafeData);

  if (!success) return { error: true, message: t("Members.createError") };

  await insertMember(data, householdId);

  revalidatePath(`/${householdId}/members`);
  return { error: false, message: t("Members.createSuccess") };
}

export async function deleteMember(memberId: string, householdId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  if (
    !validateUuid(householdId) ||
    !validateUuid(memberId) ||
    (await assertMemberWriteAccess(householdId))
  ) {
    return { error: true, message: t("Members.deleteError") };
  }

  await deleteMemberDB(memberId, householdId);

  revalidatePath(`/${householdId}/settings`);

  return { error: false, message: t("Members.deleteSuccess") };
}

export async function updateMember(
  unsafeData: z.infer<typeof membersSchema>,
  memberId: string,
  householdId: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  const { data, success } = membersSchema.safeParse(unsafeData);

  if (!success) return { error: true, message: t("Members.updateError") };

  await assertMemberWriteAccess(householdId);

  await updateMemberDB({ memberId, name: data.name }, householdId);

  revalidatePath(`/${householdId}/members`);
  return { error: false, message: t("Members.updateSuccess") };
}
