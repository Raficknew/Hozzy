"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { validate as validateUuid } from "uuid";
import type { z } from "zod";
import type { CategoriesOfExpanse } from "@/drizzle/schema";
import {
  deleteCategory as deleteCategoryDB,
  insertCategory,
  updateCategory as updateCategoryDB,
} from "@/features/categories/db/categories";
import { assertCategoryCreateAbility } from "@/features/categories/permissions/category";
import { categorySchema } from "@/features/categories/schema/category";
import { auth } from "@/lib/auth";

export async function createCategory(
  unsafeData: z.infer<typeof categorySchema>,
  householdId: string,
) {
  const { data, success } = categorySchema.safeParse(unsafeData);
  const t = await getTranslations("ReturnMessages");

  if (!success) return { error: true, message: t("Categories.createError") };

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  await assertCategoryCreateAbility(householdId);

  await insertCategory({
    ...data,
    householdId,
    categoryType: data.categoryType as CategoriesOfExpanse,
  });

  revalidatePath(`/${householdId}/settings`);

  return { error: false, message: t("Categories.createSuccess") };
}

export async function updateCategory(
  unsafeData: z.infer<typeof categorySchema>,
  categoryId: string,
  householdId: string,
  type: CategoriesOfExpanse,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  const { data, success } = categorySchema.safeParse(unsafeData);

  if (!success) return { error: true, message: t("Categories.updateError") };

  await updateCategoryDB({
    ...data,
    id: categoryId,
    householdId,
    categoryType: type,
  });

  revalidatePath(`/${householdId}/settings`);

  return { error: false, message: t("Categories.updateSuccess") };
}

export async function deleteCategory(categoryId: string, householdId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("ReturnMessages");

  if (session?.user.id == null)
    return { error: true, message: t("User.invalidId") };

  if (!validateUuid(householdId) || !validateUuid(categoryId)) {
    return { error: true, message: t("Categories.deleteError") };
  }

  await deleteCategoryDB(categoryId, householdId);

  revalidatePath(`/${householdId}/settings`);

  return { error: false, message: t("Categories.deleteSuccess") };
}
