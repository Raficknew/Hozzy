"use client";
import { useLocale } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { CategoryWithTransactions, Member } from "@/global/types";

function assignTransactionPricesToMembers(
  members: Member[],
  categories: CategoryWithTransactions,
) {
  const allTransactions = categories.flatMap(
    (category) => category.transactions,
  );
  const membersWithPrices = members.map((member) => ({
    ...member,
    total: 0,
  }));
  allTransactions.forEach((transaction) => {
    const member = membersWithPrices.find(
      (member) => member.id === transaction.memberId,
    );
    if (member) {
      member.total = (member.total || 0) + transaction.price;
    }
  });

  return membersWithPrices;
}

export function TransactionBarChart({
  maxValue,
  members,
  categories,
  title,
}: {
  maxValue: number;
  members: Member[];
  categories: CategoryWithTransactions;
  title: string;
}) {
  const data = assignTransactionPricesToMembers(members, categories);
  const chartConfig = {
    total: {
      label: title,
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;
  const locale = useLocale();

  return (
    <ChartContainer className="h-[190px] w-full" config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ left: -20, right: 12, top: 12, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
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
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          tickFormatter={(value) =>
            members.length >= 4 && value.length > 24
              ? `${value.slice(0, 12)}...`
              : value
          }
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
