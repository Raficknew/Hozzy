import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { BalanceTracker } from "@/components/molecules/BalanceTracker";
import { RecentTransactionTable } from "@/components/molecules/RecentTransactionTable";
import { ExpensesLineChart } from "@/components/organisms/ExpensesLineChart";
import { FinancialSummaryChart } from "@/components/organisms/FinancialSummaryChart";
import { getCategoriesWithTransactions, getHousehold } from "@/global/actions";
import { countPricesOfTransactionsRelatedToTheirTypes } from "@/global/functions";

export default async function HouseholdPage({
  params,
  searchParams,
}: {
  params: Promise<{ householdId: string }>;
  searchParams: Promise<{ date: string }>;
}) {
  const { householdId } = await params;
  const household = await getHousehold(householdId);

  if (household == null) notFound();

  const { date } = await searchParams;
  const parsedDate = date ? new Date(date) : new Date();
  const categories =
    (await getCategoriesWithTransactions(householdId, parsedDate)) || [];
  const t = await getTranslations("Dashboard.charts");

  const prices = countPricesOfTransactionsRelatedToTheirTypes(categories);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex flex-col gap-2 2xl:flex-row">
        <BalanceTracker currency={household.currencyCode} prices={prices} />
        <Suspense>
          <ExpensesLineChart
            maxValue={prices.totalInExpenses}
            date={parsedDate}
            categories={categories}
            title={t("expenses")}
          />
        </Suspense>
      </div>
      <div className="flex flex-col gap-2 2xl:flex-row">
        <FinancialSummaryChart
          title={t("incomes")}
          householdId={household.id}
          defaultTransactionType="income"
          maxValue={prices.incomes}
          categories={categories.filter((c) => c.categoryType === "incomes")}
          gradient="radial-gradient(ellipse at bottom, #00C48C30 0%, #21212266 100%)"
          currency={household.currencyCode}
        />
        <FinancialSummaryChart
          title={t("expenses")}
          householdId={household.id}
          defaultTransactionType="expense"
          maxValue={prices.totalInExpenses}
          categories={categories.filter((c) => c.categoryType !== "incomes")}
          gradient="radial-gradient(ellipse at bottom, #F83B3B4D 0%, #21212266 100%)"
          currency={household.currencyCode}
        />
      </div>
      <RecentTransactionTable
        categories={categories}
        members={household.members}
        currency={household.currencyCode}
        householdId={household.id}
      />
    </div>
  );
}
