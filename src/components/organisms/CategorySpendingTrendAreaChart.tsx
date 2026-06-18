"use client";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { Transaction } from "@/global/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const getCategorySpendingData = (
  transactions: Transaction[],
  date: Date,
): { month: string; total: number }[] => {
  const monthTotals: Record<string, number> = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });
    monthTotals[month] = (monthTotals[month] ?? 0) + t.price;
  });

  if (!monthTotals[date.toLocaleString("default", { month: "short" })]) {
    return [];
  }

  return Object.entries(monthTotals).map(([month, total]) => ({
    month,
    total,
  }));
};

export function CategorySpendingTrendAreaChart({
  transactions,
  currentDate,
}: {
  transactions: Transaction[];
  currentDate: Date;
}) {
  const t = useTranslations("AnalyticsPage.charts");
  const categorySpendingData = getCategorySpendingData(
    transactions,
    currentDate,
  );
  if (categorySpendingData.length < 2) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("spendingTrend")}</CardTitle>
        </CardHeader>
        <CardContent className="flex aspect-square h-[174px] items-center justify-center">
          <p className="text-muted-foreground">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    desktop: {
      label: t("totalSpent"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("spendingTrend")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[174px] w-full">
          <AreaChart
            accessibilityLayer
            data={categorySpendingData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="total"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
