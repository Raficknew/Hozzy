"use client";
import { useTranslations } from "next-intl";
import { Pie, PieChart } from "recharts";
import type { Member, Transaction } from "@/global/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const getMembersSumOfTransactions = (transactions: Transaction[]) => {
  const memberTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    memberTotals[t.memberId] = (memberTotals[t.memberId] ?? 0) + t.price;
  });
  return Object.entries(memberTotals).map(([name, total]) => ({ name, total }));
};

export function MembersPieChart({
  transactions,
  members,
}: {
  transactions: Transaction[];
  members: Member[];
}) {
  const t = useTranslations("AnalyticsPage.charts");
  const membersSum = getMembersSumOfTransactions(transactions);

  const chartConfig = Object.fromEntries(
    membersSum.map((member, i) => [
      member.name,
      {
        label: members[members.findIndex((m) => m.id === member.name)]?.name,
        color: `var(--chart-${i + 1})`,
      },
    ]),
  ) satisfies ChartConfig;

  const chartDataWithFill = membersSum.map((entry) => ({
    ...entry,
    fill: chartConfig[entry.name]?.color,
  }));

  if (membersSum.length === 0) {
    return (
      <Card className="md:w-1/3 w-full">
        <CardHeader>
          <CardTitle>{t("membersPieChart")}</CardTitle>
        </CardHeader>
        <CardContent className="flex aspect-square max-h-[300px] items-center justify-center">
          <p className="text-muted-foreground">{t("noData")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:w-1/3 w-full ">
      <CardHeader>
        <CardTitle>{t("membersPieChart")}</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[350px] w-full"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" hideLabel />}
            />
            <Pie data={chartDataWithFill} dataKey="total" nameKey="name" />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
