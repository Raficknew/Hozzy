"use client";
import { endOfMonth } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { CategoryWithTransactions } from "@/global/types";

function getSumOfExpensesByDay(
  date: Date,
  categories: CategoryWithTransactions,
) {
  const numberOfLastDay = endOfMonth(date).getDate();
  const data = Array.from({ length: numberOfLastDay }, (_, i) => ({
    day: i + 1,
    totalSpent: 0,
  }));
  const allTransactions = categories.flatMap(
    (category) => category.transactions,
  );

  allTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (transaction.type === "income") return;
    const day = transactionDate.getDate();

    data[day - 1]!.totalSpent += transaction.price;
  });

  return data;
}

export function ExpensesLineChart({
  maxValue,
  date,
  categories,
  title,
}: {
  maxValue: number;
  date: Date;
  categories: CategoryWithTransactions;
  title: string;
}) {
  const sumOfExpensesByDay = getSumOfExpensesByDay(date, categories);
  const locale = useLocale();
  const t = useTranslations("Dashboard.charts");
  const chartConfig = {
    totalSpent: {
      label: t("totalSpent"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-[280px] w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[210px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={sumOfExpensesByDay}
            margin={{ left: -20, right: 12, top: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              width={45}
              domain={[0, maxValue]}
              tickFormatter={(value) =>
                Number(value).toLocaleString(locale, { notation: "compact" })
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="totalSpent"
              type="linear"
              stroke="var(--color-totalSpent)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
