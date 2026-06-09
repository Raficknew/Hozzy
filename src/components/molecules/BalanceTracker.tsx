import { Wallet05Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";
import { Price } from "@/components/atoms/Price";
import { ExpenseProgressBar } from "@/components/organisms/ExpenseProgressBar";
import type { Prices } from "@/global/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export async function BalanceTracker({
  currency,
  prices,
}: {
  currency: string;
  prices: Prices;
}) {
  const t = await getTranslations("Dashboard.ExpenseTracker");
  return (
    <Card className="flex flex-col 2xl:w-1/4 w-full gap-7 h-[280px]">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <HugeiconsIcon icon={Wallet05Icon} />
          <h4 className="text-xl">{t("balance")}</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full justify-between mt-3">
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
      </CardContent>
    </Card>
  );
}
