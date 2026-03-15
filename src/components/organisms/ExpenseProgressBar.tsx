"use client";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Price } from "@/components/atoms/Price";
import { cn } from "@/lib/utils";

const returnChangeOption = (currentCategoryType: string) => {
  const options = ["fixed", "fun", "future_you"];
  const currentIndex = options.indexOf(currentCategoryType);
  const nextOption = options[(currentIndex + 1) % options.length];
  const backOption =
    options[(currentIndex - 1 + options.length) % options.length];
  return { nextOption, backOption };
};

const checkGoalProgress = (categoryType: string, value: number) => {
  let expected = 0;
  let progress = "";

  const goalMap = {
    fixed: 50,
    fun: 30,
    future_you: 20,
  };

  expected = goalMap[categoryType as keyof typeof goalMap] ?? 0;

  if (value > expected) {
    progress = "TOO_MUCH";
  } else if (value >= expected - 10) {
    progress = "IDEALLY";
  } else {
    progress = "TOO_LITTLE";
  }

  return { expected, progress };
};

export function ExpenseProgressBar({
  totalInTransactions,
  categoriesCounted,
  currency,
}: {
  totalInTransactions: number;
  categoriesCounted: {
    fixed: number;
    fun: number;
    future_you: number;
  };
  currency: string;
}) {
  const t = useTranslations("Dashboard.ExpenseTracker");
  const [currentCategoryType, setCurrentCategoryType] = useState<
    "fixed" | "fun" | "future_you"
  >("fixed");

  const changeCurrentType = returnChangeOption(currentCategoryType);

  const currentCategoryTypePrice = categoriesCounted[currentCategoryType];

  const assigned =
    totalInTransactions > 0
      ? (currentCategoryTypePrice / totalInTransactions) * 100
      : 0;

  const goalProgress = checkGoalProgress(currentCategoryType, assigned);

  return (
    <div className="flex flex-col gap-3">
      <ProgressBar
        categoriesCounted={categoriesCounted}
        balance={totalInTransactions}
      />
      <div className="flex flex-col gap-2 w-full bg-[#161616] rounded-lg py-2 px-4">
        <div className="flex justify-between">
          <div className="flex gap-1">
            <p
              className={cn(
                "text-lg",
                goalProgress.progress === "IDEALLY" && "text-green-400",
                goalProgress.progress === "TOO_MUCH" && "text-red-400",
                goalProgress.progress === "TOO_LITTLE" && "text-gray-300",
                assigned < 0 && "text-red-400",
              )}
            >
              {`${assigned ? assigned.toFixed(2) : "0"}%`}
            </p>
            <p className="self-end text-[10px] text-white/50">
              {goalProgress.expected &&
                `${t("goal")} ${goalProgress.expected}%`}
            </p>
          </div>
          <div className="flex items-center gap-1 *:rounded-full *:bg-white *:text-black *:cursor-pointer ">
            <HugeiconsIcon
              onClick={() =>
                setCurrentCategoryType(
                  changeCurrentType.backOption as
                    | "fixed"
                    | "fun"
                    | "future_you",
                )
              }
              strokeWidth={3}
              size={16}
              icon={ArrowLeft01Icon}
            />
            <HugeiconsIcon
              onClick={() =>
                setCurrentCategoryType(
                  changeCurrentType.nextOption as
                    | "fixed"
                    | "fun"
                    | "future_you",
                )
              }
              strokeWidth={3}
              size={16}
              icon={ArrowRight01Icon}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <p
            className={cn(
              "text-lg font-semibold",
              currentCategoryType === "fixed" && "text-[#7047EB]",
              currentCategoryType === "fun" && "text-[#9B8DF8]",
              currentCategoryType === "future_you" && "text-[#BDB6FC]",
            )}
          >
            {t(`${currentCategoryType}`)}
          </p>
          <Price
            className="text-lg font-semibold"
            currency={currency}
            price={currentCategoryTypePrice}
          />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  categoriesCounted,
  balance,
}: {
  categoriesCounted: { fixed: number; fun: number; future_you: number };
  balance: number;
}) {
  const fixedPercent =
    balance > 0 ? (categoriesCounted.fixed / balance) * 100 : 0;
  const funPercent = balance > 0 ? (categoriesCounted.fun / balance) * 100 : 0;
  const futureYouPercent =
    balance > 0 ? (categoriesCounted.future_you / balance) * 100 : 0;

  return (
    <div className="flex h-6 grow bg-neutral-600 rounded-sm">
      <div
        className={cn(
          "bg-[#7047EB] z-10 rounded-l-sm",
          fixedPercent === 100 && "rounded-sm",
        )}
        style={{
          width: `${fixedPercent}%`,
        }}
      ></div>
      <div
        className={cn(
          " bg-[#9B8DF8] z-10",
          fixedPercent === 0 && "rounded-l-sm",
          funPercent === 100 && "rounded-sm",
        )}
        style={{
          width: `${funPercent}%`,
        }}
      ></div>
      <div
        className={cn(
          " bg-[#BDB6FC] z-10 rounded-r-sm",
          fixedPercent === 0 && funPercent === 0 && "rounded-l-sm",
          futureYouPercent === 100 && "rounded-sm",
        )}
        style={{
          width: `${futureYouPercent}%`,
        }}
      ></div>
    </div>
  );
}
