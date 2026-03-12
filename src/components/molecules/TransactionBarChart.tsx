"use client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { CategoryWithTransactions, Member } from "@/global/types";

function assignTransactionPricesToMembers(
  members: Member[],
  categories: CategoryWithTransactions,
) {
  const labels = members.map((m) => m.name);
  const dataMap: Record<string, number> = {};

  members.forEach((member) => {
    dataMap[member.id] = 0;
  });

  categories.forEach((category) => {
    category.transactions.forEach((transaction) => {
      const memberId = transaction.memberId;
      if (dataMap[memberId] !== undefined && transaction.price !== undefined) {
        dataMap[memberId] += transaction.price;
      }
    });
  });
  const dataForChart = members.map((member) => dataMap[member.id]);

  return { labels, dataForChart };
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

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
  const { labels, dataForChart } = assignTransactionPricesToMembers(
    members,
    categories,
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: dataForChart,
        backgroundColor: "#7047EBBF",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          callback: (_tickValue: string | number, index: number) => {
            const person = labels[index];
            if (!person) return `Member ${index}`;
            if (person?.length > 25) {
              return `${person.substring(0, 10)}...`;
            }
            return person;
          },
        },
      },
      y: {
        min: 0,
        max: maxValue,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-full">
      <Bar data={data} options={options} />
    </div>
  );
}
