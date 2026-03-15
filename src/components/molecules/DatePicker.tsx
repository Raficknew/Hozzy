"use client";
import { Calendar02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { enUS, pl } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { capitalize } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function DatePicker() {
  let defaultDate: Date = new Date();
  const defaultDateString = useSearchParams().get("date");

  if (defaultDateString != null) {
    defaultDate = new Date(defaultDateString);
  }

  const [isOpened, setIsOpened] = useState(false);

  const [date, setDate] = useState(defaultDate);
  const [currentMonth, setCurrentMonth] = useState<number | null>(
    defaultDate.getMonth(),
  );
  const [year, setYear] = useState<number | null>(defaultDate.getFullYear());
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const locale = useLocale();
  let currentLocale = pl;
  switch (locale) {
    case "pl":
      currentLocale = pl;
      break;
    case "en":
      currentLocale = enUS;
      break;
  }

  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(date.getFullYear(), i, 1),
  );

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    setDate(new Date(newYear, currentMonth ?? 0, 1));
    setCurrentMonth(null);
  };

  const handleDateChange = (month: number) => {
    if (currentMonth === month) return;

    setCurrentMonth(month);

    const newDate = new Date(Date.UTC(year ?? date.getFullYear(), month, 1));
    setDate(newDate);

    const searchParams = new URLSearchParams();
    searchParams.set("date", newDate.toISOString());
    router.push(`?${searchParams}`);
  };

  return (
    <div className="flex flex-col items-end sm:items-center z-20 sm:ml-25">
      <button
        type="button"
        className="sm:bg-card bg-accent flex items-center justify-center h-full sm:w-[270px] text-center sm:py-2 rounded-lg cursor-pointer"
        onClick={() => setIsOpened(!isOpened)}
      >
        <p className="font-semibold hidden sm:block">
          {date
            ? capitalize(format(date, "LLLL yyyy", { locale: currentLocale }))
            : capitalize(format(date, "yyyy", { locale: currentLocale }))}
        </p>
        <p className="sm:hidden p-2">
          <HugeiconsIcon
            icon={Calendar02Icon}
            className="size-7"
            strokeWidth={2}
          />
        </p>
      </button>
      {isOpened && (
        <div className="fixed top-13 left-0 sm:w-auto sm:left-auto w-full grid grid-cols-3 sm:grid-cols-4 gap-3 text-center bg-card p-5 rounded-lg drop-shadow-xl">
          {!year &&
            years.map((callendarYear) => (
              <button
                type="button"
                key={callendarYear}
                className={cn(
                  "cursor-pointer px-2 py-1 text-sm rounded-full hover:bg-white/50",
                )}
                onClick={() => handleYearChange(callendarYear)}
              >
                {callendarYear}
              </button>
            ))}

          {year &&
            months.map((month) => {
              const isCurrentMonth =
                month.getMonth() === currentMonth &&
                month.getFullYear() === year;

              return (
                <button
                  type="button"
                  key={month.getMonth()}
                  className={cn(
                    "cursor-pointer px-2 py-1 text-sm rounded-full",
                    isCurrentMonth && "bg-foreground/10",
                  )}
                  onClick={() =>
                    month !== date && handleDateChange(month.getMonth())
                  }
                >
                  {capitalize(format(month, "LLLL", { locale: currentLocale }))}
                </button>
              );
            })}
          <button
            type="button"
            className="absolute left-2 top-2 cursor-pointer"
            onClick={() => {
              setYear(null);
              setCurrentMonth(null);
            }}
          >
            <HugeiconsIcon strokeWidth={2} icon={Cancel01Icon} size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
