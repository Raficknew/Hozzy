import {
  ChartAverageIcon,
  CreditCardIcon,
  SummationCircleIcon,
} from "@hugeicons/core-free-icons";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { CategorySelectSkeleton } from "@/components/atoms/CardSkeleton";
import { StatisticCard } from "@/components/atoms/StatisticCard";
import { CategorySelect } from "@/components/molecules/CategorySelect";
import { CategoryBarChart } from "@/components/organisms/CategoryBarChart";
import { CategorySpendingTrendAreaChart } from "@/components/organisms/CategorySpendingTrendAreaChart";
import { MembersPieChart } from "@/components/organisms/MembersPieChart";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCategories,
  getMembers,
  getTransactionsForCategory,
  getTransactionsForCategoryForPastSixMonths,
} from "@/global/actions";
import type { Transaction } from "@/global/types";

const getTransactionSummaryTransactionsData = (transactions: Transaction[]) => {
  const sumOfTransactions = transactions.reduce((sum, transaction) => {
    return sum + transaction.price;
  }, 0);
  return {
    numberOfTransactions: transactions.length,
    sumOfTransactions,
    averageTransactionValue:
      transactions.length > 0 ? sumOfTransactions / transactions.length : 0,
  };
};

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
  const statistics = getTransactionSummaryTransactionsData(transactions ?? []);
  const t = await getTranslations("AnalyticsPage.statistics");

  return (
    <main className="flex flex-col gap-4 h-full">
      <article className="flex md:flex-row flex-col gap-4">
        <Suspense fallback={<CategorySelectSkeleton />}>
          <CategorySelect
            selectedCategoryId={categoryId || null}
            categories={categories}
          />
        </Suspense>
        <Card className="w-full">
          <CardContent className="flex flex-wrap gap-2 justify-between h-full">
            <StatisticCard
              title={t("numberOfTransactions")}
              value={statistics.numberOfTransactions}
              icon={CreditCardIcon}
            />
            <StatisticCard
              title={t("total")}
              value={statistics.sumOfTransactions}
              icon={SummationCircleIcon}
              asPrice
            />
            <StatisticCard
              title={t("average")}
              value={statistics.averageTransactionValue}
              icon={ChartAverageIcon}
              asPrice
            />
          </CardContent>
        </Card>
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
