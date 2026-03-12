"use client";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { endOfMonth } from "date-fns";
import { Line } from "react-chartjs-2";
import type { CategoryWithTransactions } from "@/global/types";

ChartJS.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function getDataForChart(date: Date, categories: CategoryWithTransactions) {
  const days = getDaysFromMonth(date);
  const values = mergeMonthExpensesToDays(days, categories);

  return { days, values };
}

function mergeMonthExpensesToDays(
  days: string[],
  categories: CategoryWithTransactions,
) {
  const expensesToDays = Object.fromEntries(days.map((day) => [day, 0]));
  const sortedDays = Object.keys(expensesToDays).sort(
    (a, b) => Number(a) - Number(b),
  );
  const allTransactions = categories.flatMap((c) => c.transactions);

  allTransactions.forEach((transaction) => {
    const day = transaction.date.getDate().toString().padStart(2, "0");
    if (
      day !== undefined &&
      expensesToDays[day] !== undefined &&
      transaction.type !== "income"
    ) {
      expensesToDays[day] += transaction.price;
    }
  });

  return sortedDays.map((day) => expensesToDays[day]);
}

function getDaysFromMonth(date: Date) {
  const numberOfLastDay = endOfMonth(date).getDate();
  return Array.from({ length: numberOfLastDay }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
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
  const dataForChart = getDataForChart(date, categories);

  const data = {
    labels: dataForChart.days,
    datasets: [
      {
        label: title,
        data: dataForChart.values,
        fill: false,
        borderColor: "#F83B3B",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
        },
        display: true,
        min: 0,
        max: maxValue,
      },
      x: {
        title: {
          display: true,
        },
        display: true,
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return (
    <div className="2xl:w-5/6 w-full min-h-[280px] bg-card rounded-lg hidden md:block ">
      <Line options={options} data={data} />
    </div>
  );
}
