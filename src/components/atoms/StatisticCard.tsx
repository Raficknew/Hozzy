import type { CreditCardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Price } from "./Price";

export function StatisticCard({
  title,
  value,
  icon,
  asPrice = false,
}: {
  title: string;
  value: number;
  icon: typeof CreditCardIcon;
  asPrice?: boolean;
}) {
  return (
    <article className="flex items-center gap-4">
      <div className="p-5 rounded-full bg-chart-2">
        <HugeiconsIcon icon={icon} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {asPrice ? (
          <Price className="text-2xl font-bold" currency="PLN" price={value} />
        ) : (
          <span className="text-2xl font-bold">{value}</span>
        )}
      </div>
    </article>
  );
}
