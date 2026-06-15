import { Suspense } from "react";
import { CategorySelectSkeleton } from "@/components/atoms/CardSkeleton";
import { CategorySelect } from "@/components/molecules/CategorySelect";
import { StatisticCards } from "@/components/molecules/StatisticCards";
import { CategoryBarChart } from "@/components/organisms/CategoryBarChart";
import { CategorySpendingTrendAreaChart } from "@/components/organisms/CategorySpendingTrendAreaChart";
import { MembersPieChart } from "@/components/organisms/MembersPieChart";
import {
  getCategories,
  getMembers,
  getTransactionsForCategory,
  getTransactionsForCategoryForPastSixMonths,
} from "@/global/actions";

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>;
  searchParams: Promise<{ date: string; categoryId: string }>;
}) {
  const [{ householdId }, { date, categoryId }] = await Promise.all([
    params,
    searchParams,
  ]);
  const currentDate = date ? new Date(date) : new Date();
  const [transactions, members, pastSixMonthsTransactions, categories] =
    await Promise.all([
      getTransactionsForCategory(categoryId, currentDate),
      getMembers(householdId),
      getTransactionsForCategoryForPastSixMonths(categoryId, currentDate),
      getCategories(householdId),
    ]);

  return (
    <main className="flex flex-col gap-4 h-full">
      <article className="flex md:flex-row flex-col gap-4">
        <Suspense fallback={<CategorySelectSkeleton />}>
          <CategorySelect
            selectedCategoryId={categoryId || null}
            categories={categories}
          />
        </Suspense>
        <StatisticCards transactions={transactions} />
      </article>
      <article className="flex md:flex-row flex-col gap-4">
        <CategoryBarChart transactions={transactions} />
        <MembersPieChart transactions={transactions} members={members} />
      </article>
      <article>
        <CategorySpendingTrendAreaChart
          transactions={pastSixMonthsTransactions}
          currentDate={currentDate}
        />
      </article>
    </main>
  );
}
