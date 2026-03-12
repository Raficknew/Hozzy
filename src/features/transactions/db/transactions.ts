import { eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { TransactionTable } from "@/drizzle/schema";

export async function insertTransaction(
  data: typeof TransactionTable.$inferInsert,
) {
  const [newTransaction] = await db
    .insert(TransactionTable)
    .values(data)
    .returning();

  if (newTransaction == null) {
    throw new Error("Failed to create Transaction");
  }

  return newTransaction;
}

export async function updateTransaction(
  data: typeof TransactionTable.$inferInsert,
) {
  const [updatedTransaciton] = await db
    .update(TransactionTable)
    .set(data)
    .where(eq(TransactionTable.id, data.id!))
    .returning();

  if (updatedTransaciton == null) {
    throw new Error("Failed to update Transaction");
  }

  return updatedTransaciton;
}

export async function deleteTransaction(transactionId: string) {
  const [deletedTransaction] = await db
    .delete(TransactionTable)
    .where(eq(TransactionTable.id, transactionId))
    .returning();

  if (deletedTransaction == null)
    throw new Error("Failed to delete Transaction");

  return deletedTransaction;
}
