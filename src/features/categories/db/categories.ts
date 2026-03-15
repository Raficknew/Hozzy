import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { CategoryTable } from "@/drizzle/schema";

export async function insertCategory(data: typeof CategoryTable.$inferInsert) {
  const [newCategory] = await db.insert(CategoryTable).values(data).returning();

  if (newCategory == null) throw new Error("Failed to create Category");

  return newCategory;
}

export async function updateCategory(data: typeof CategoryTable.$inferInsert) {
  const newCategory = await db
    .update(CategoryTable)
    .set(data)
    .where(eq(CategoryTable.id, data.id!))
    .returning();

  if (newCategory == null) throw new Error("Failed to update Category");

  return newCategory;
}

export async function deleteCategory(categoryId: string, householdId: string) {
  const [deletedCategory] = await db
    .delete(CategoryTable)
    .where(
      and(
        eq(CategoryTable.id, categoryId),
        eq(CategoryTable.householdId, householdId),
      ),
    )
    .returning();

  if (deletedCategory == null) throw new Error("Failed to delete Category");

  return deletedCategory;
}
