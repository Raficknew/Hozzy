import { Price } from "@/components/atoms/Price";
import { TransactionBarChart } from "@/components/molecules/TransactionBarChart";
import { TransactionDialog } from "@/features/transactions/components/TransactionDialog";
import { getCategories, getMembers } from "@/global/actions";
import type { CategoryWithTransactions } from "@/global/types";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

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
  const [members, categoriesForTransactions] = await Promise.all([
    getMembers(householdId),
    getCategories(householdId),
  ]);
  return (
    <Card className="flex relative bg-card rounded-lg justify-between 2xl:w-1/2 w-full md:h-[300px] h-[150px]">
      <CardHeader className="w-full z-10 md:m-0">
        <CardTitle className="text-2xl font-light">
          {title}
          <Price
            className={cn(
              "text-3xl  *:font-medium",
              maxValue >= 100000 && "sm:text-3xl text-xl",
              maxValue > 1000000 && "sm:text-3xl text-lg",
            )}
            price={maxValue}
            currency={currency}
          />
        </CardTitle>

        <CardAction className="md:relative absolute md:h-fit h-full inset-0 z-20">
          <TransactionDialog
            householdId={householdId}
            defaultTransactionType={defaultTransactionType}
            members={members}
            categories={categoriesForTransactions}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="z-10 h-full hidden md:block">
        <TransactionBarChart
          title={title}
          categories={categories}
          maxValue={maxValue}
          members={members}
        />
      </CardContent>

      <div
        className="absolute inset-0 z-1 w-full h-full"
        style={{
          background: gradient,
          opacity: 1,
        }}
      />
    </Card>
  );
}
