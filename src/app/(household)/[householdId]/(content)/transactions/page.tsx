import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PaginationTransactionTable } from "@/components/organisms/PaginationTransactionTable";
import {
  getCategories,
  getCategoriesWithTransactions,
  getHousehold,
} from "@/global/actions";
import { sortTransactionsByDateAndCreation } from "@/global/functions";

export const metadata: Metadata = {
  title: "Transactions",
  description: "View and filter household transactions.",
};

export default async function HouseholdTransactionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>;
  searchParams: Promise<{ date: string }>;
}) {
  const [{ householdId }, { date }] = await Promise.all([params, searchParams]);
  const currentDate = date ? new Date(date) : new Date();
  const [household, categoriesForTransactions, t, categories] =
    await Promise.all([
      getHousehold(householdId),
      getCategories(householdId),
      getTranslations("TransactionsPage"),
      getCategoriesWithTransactions(householdId, currentDate),
    ]);

  if (household == null) notFound();
  const categoriesWithTransactions = categories || [];

  const allTransactions = categoriesWithTransactions.flatMap((cat) =>
    cat.transactions.map((transaction) => ({
      ...transaction,
      categoryName: cat.name,
    })),
  );

  const sortedTransactions = sortTransactionsByDateAndCreation(allTransactions);

  return (
    <div className="w-full bg-sidebar rounded-sm p-4">
      {sortedTransactions.length > 0 ? (
        <PaginationTransactionTable
          householdId={householdId}
          transactions={sortedTransactions}
          members={household.members}
          currencyCode={household.currencyCode}
          categories={categoriesForTransactions}
        />
      ) : (
        <p>{t("zeroTransactions")}</p>
      )}
    </div>
  );
}
