"use client";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { Transaction } from "@/global/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  total: {
    label: "Total",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const getChartData = (transactions: Transaction[]) => {
  const categoryTotals: Record<string, number> = {};

  for (const transaction of transactions) {
    const day = new Date(transaction.date).getDate().toString();
    if (!categoryTotals[day]) {
      categoryTotals[day] = 0;
    }
    categoryTotals[day] += transaction.price;
  }

  return Object.entries(categoryTotals).map(([day, total]) => ({
    name: day,
    total,
  }));
};

export function CategoryBarChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const chartData = getChartData(transactions);
  const locale = useLocale();
  const t = useTranslations("AnalyticsPage.charts");

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <h1>{t("expensesByCategory")}</h1>
        </CardHeader>
        <CardContent className="flex h-[350px] items-center justify-center">
          <p className="text-muted-foreground">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <h1>{t("expensesByCategory")}</h1>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[350px] w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                Number(value).toLocaleString(locale, { notation: "compact" })
              }
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
