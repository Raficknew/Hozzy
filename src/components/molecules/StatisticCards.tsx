import {
  ChartAverageIcon,
  CreditCardIcon,
  SummationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";
import { getTransactionsForCategory } from "@/global/actions";
import type { Transaction } from "@/global/types";
import { Price } from "../atoms/Price";
import { Card, CardContent } from "../ui/card";

const getStatistics = (transactions: Transaction[]) => {
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

export async function StatisticCards({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const statistics = getStatistics(transactions ?? []);
  const t = await getTranslations("AnalyticsPage.statistics");

  return (
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
        />
        <StatisticCard
          title={t("average")}
          value={statistics.averageTransactionValue}
          icon={ChartAverageIcon}
        />
      </CardContent>
    </Card>
  );
}

function StatisticCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: typeof CreditCardIcon;
}) {
  return (
    <article className="flex items-center gap-4">
      <div className="p-5 rounded-full bg-chart-2">
        <HugeiconsIcon icon={icon} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Price className="text-2xl font-bold" currency="PLN" price={value} />
      </div>
    </article>
  );
}
