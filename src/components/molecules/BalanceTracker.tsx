import { Wallet05Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";
import { Price } from "@/components/atoms/Price";
import { ExpenseProgressBar } from "@/components/organisms/ExpenseProgressBar";
import type { Prices } from "@/global/types";

export async function BalanceTracker({
  currency,
  prices,
}: {
  currency: string;
  prices: Prices;
}) {
  const t = await getTranslations("Dashboard.ExpenseTracker");
  return (
    <div className="flex flex-col 2xl:w-1/6 w-full gap-7 bg-card p-5 rounded-lg h-[280px]">
      <div className="flex gap-2 items-center">
        <HugeiconsIcon icon={Wallet05Icon} />
        <h4 className="text-xl">{t("balance")}</h4>
      </div>
      <Price
        className="font-semibold text-2xl"
        currency={currency}
        price={prices.balance}
      />
      <ExpenseProgressBar
        totalInTransactions={prices.totalInExpenses}
        categoriesCounted={prices}
        currency={currency}
      />
    </div>
  );
}
