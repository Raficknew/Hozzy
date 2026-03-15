import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";
import { Price } from "@/components/atoms/Price";
import { TransactionBarChart } from "@/components/molecules/TransactionBarChart";
import { DialogTrigger } from "@/components/ui/dialog";
import { TransactionDialog } from "@/features/transactions/components/TransactionDialog";
import { getCategories, getMembers } from "@/global/actions";
import type { CategoryWithTransactions } from "@/global/types";
import { cn } from "@/lib/utils";

export async function FinancialSummaryChart({
  maxValue,
  categories,
  defaultTransactionType,
  title,
  householdId,
  gradient,
  currency,
}: {
  maxValue: number;
  categories: CategoryWithTransactions;
  defaultTransactionType: string;
  title: string;
  householdId: string;
  gradient: string;
  currency: string;
}) {
  const members = await getMembers(householdId);
  const t = await getTranslations("Dashboard.charts");
  const categoriesForTransactions = await getCategories(householdId);
  return (
    <div className="flex relative bg-card rounded-lg md:p-4 gap-10 justify-between 2xl:w-1/2 w-full md:h-[300px] h-[150px]">
      <div className="w-full z-10 ml-4 mt-4 md:m-0">
        <p className="text-2xl font-light">{title}</p>
        <Price
          className={cn(
            "text-3xl  *:font-medium",
            maxValue >= 100000 && "sm:text-3xl text-xl",
            maxValue > 1000000 && "sm:text-3xl text-lg",
          )}
          price={maxValue}
          currency={currency}
        />
      </div>
      <div className="z-10 hidden md:block">
        <TransactionBarChart
          title={title}
          categories={categories}
          maxValue={maxValue}
          members={members}
        />
      </div>
      <div className="flex items-start w-full justify-end z-10">
        <TransactionDialog
          householdId={householdId}
          defaultTransactionType={defaultTransactionType}
          members={members}
          categories={categoriesForTransactions}
        >
          <DialogTrigger className="md:bg-[#7047EB] bg-[#0F0F0F] md:rounded-full rounded-r-xs px-5 py-2 text-xs flex items-center gap-1 cursor-pointer md:h-max h-full">
            <HugeiconsIcon
              className="md:size-5 size-10"
              icon={PlusSignIcon}
              strokeWidth={2}
            />
            <p className="md:block hidden">{t("add")}</p>
          </DialogTrigger>
        </TransactionDialog>
      </div>
      <div
        className="absolute inset-0 z-1 w-full h-full"
        style={{
          background: gradient,
          opacity: 1,
        }}
      />
    </div>
  );
}
