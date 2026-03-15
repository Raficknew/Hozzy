import { toast } from "sonner";
import { v4 as uuidGenerate } from "uuid";
import type { CategoryWithTransactions, Transaction } from "@/global/types";

export const createUuid = (): string => {
  return uuidGenerate();
};

export const countPricesOfTransactionsRelatedToTheirTypes = (
  categories: CategoryWithTransactions,
) => {
  const sums = {
    fixed: 0,
    fun: 0,
    future_you: 0,
    incomes: 0,
  };

  categories.forEach((category) => {
    if (Object.hasOwn(sums, category.categoryType)) {
      category.transactions.forEach((t) => {
        sums[category.categoryType] += t.price;
      });
    }
  });

  const balance = sums.incomes - (sums.fixed + sums.fun + sums.future_you);
  const totalInExpenses = sums.fixed + sums.fun + sums.future_you;

  return {
    ...sums,
    balance,
    totalInExpenses,
  };
};

export const performFormSubmitAction = async (
  action: () => Promise<{ error: boolean; message: string }>,
  onSuccess?: () => void,
) => {
  const result = await action();

  if (result.error) {
    toast.error(result.message);
    return;
  }

  onSuccess?.();
  toast.success(result.message);
};

export const sortTransactionsByDateAndCreation = (
  transactions: Transaction[],
) => {
  return transactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) return dateB - dateA;

    const createA = new Date(a.createdAt).getTime();
    const createB = new Date(b.createdAt).getTime();
    return createB - createA;
  });
};
