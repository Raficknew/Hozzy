"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const chartData = [
  { name: "Category A", total: 400 },
  { name: "Category B", total: 300 },
  { name: "Category C", total: 200 },
  { name: "Category D", total: 100 },
];

export function CategoryBarChart() {
  return (
    <Card>
      <CardHeader>
        <h1>Category Bar Chart</h1>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />

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
