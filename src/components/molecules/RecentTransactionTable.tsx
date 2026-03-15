import { ScratchCardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";
import { getCategories } from "@/global/actions";
import { sortTransactionsByDateAndCreation } from "@/global/functions";
import type { CategoryWithTransactions, Member } from "@/global/types";
import { TransactionTable } from "./TransactionTable";

export async function RecentTransactionTable({
  categories,
  members,
  currency,
  householdId,
}: {
  categories: CategoryWithTransactions;
  members: Member[];
  currency: string;
  householdId: string;
}) {
  const categoriesForTransactions = await getCategories(householdId);

  const allTransactions = categories.flatMap((cat) =>
    cat.transactions.map((transaction) => ({
      ...transaction,
      categoryName: cat.name,
    })),
  );

  const sortedTransactions = sortTransactionsByDateAndCreation(allTransactions);

  const recentTransactions = sortedTransactions.slice(0, 10);

  const t = await getTranslations("TransactionTable");

  return (
    <div className="flex flex-col p-4 bg-sidebar rounded-lg h-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HugeiconsIcon strokeWidth={2} icon={ScratchCardIcon} />
          <h1 className="sm:text-2xl text-xl font-light">{t("latest")}</h1>
        </div>
      </div>
      <TransactionTable
        categories={categoriesForTransactions}
        transactions={recentTransactions}
        members={members}
        currency={currency}
        householdId={householdId}
      />
    </div>
  );
}
