"use server";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { validate as validateUuid } from "uuid";
import type { z } from "zod";
import { updateUser as updateUserDB } from "@/features/users/db/users";
import { usersSchema } from "@/features/users/schema/users";
import { auth } from "@/lib/auth";

export async function updateUser(
  unsafeData: z.infer<typeof usersSchema>,
  userId: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  const { data, success } = usersSchema.safeParse(unsafeData);

  if (!success) return { error: true, message: t("User.updateError") };

  if (!validateUuid(userId))
    return { error: true, message: t("User.invalidId") };

  await updateUserDB(data, userId);

  return { error: false, message: t("User.updateSuccess") };
}
