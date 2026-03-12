import { count, eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { CategoryTable } from "@/drizzle/schema";
import { MAX_CATEGORIES_PER_HOUSEHOLD } from "@/global/limits";

export async function assertCategoryCreateAbility(householdId: string) {
  if (!householdId) throw "HouseholdNotFound";

  const result = await db
    .select({ count: count() })
    .from(CategoryTable)
    .where(eq(CategoryTable.householdId, householdId));

  const categoriesCount = result[0]?.count ?? 0;

  if (categoriesCount < MAX_CATEGORIES_PER_HOUSEHOLD) {
    return;
  }

  throw "YouReachedALimitOfCategories";
}
