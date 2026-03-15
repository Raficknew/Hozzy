"use client";
import { ScratchCardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { TransactionTable } from "@/components/molecules/TransactionTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Member, Transaction } from "@/global/types";

export function PaginationTransactionTable({
  transactions,
  members,
  currencyCode,
  householdId,
  categories,
}: {
  transactions: Transaction[];
  members: Member[];
  currencyCode: string;
  householdId: string;
  categories: Category[];
}) {
  const TRANSACTIONS_PER_PAGE = 20;
  const [currentShowingTransactions, setCurrentShowingTransactions] = useState<
    Transaction[]
  >(transactions.slice(0, TRANSACTIONS_PER_PAGE));
  const pages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const t = useTranslations("TransactionsPage");

  useEffect(() => {
    setCurrentPage(1);
    setCurrentShowingTransactions(transactions.slice(0, TRANSACTIONS_PER_PAGE));
  }, [transactions]);

  useEffect(() => {
    setCurrentShowingTransactions(
      transactions.slice(
        (currentPage - 1) * TRANSACTIONS_PER_PAGE,
        currentPage * TRANSACTIONS_PER_PAGE,
      ),
    );
  }, [currentPage, transactions]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setCurrentShowingTransactions(
      transactions.slice(
        (pageNumber - 1) * TRANSACTIONS_PER_PAGE,
        pageNumber * TRANSACTIONS_PER_PAGE,
      ),
    );
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon strokeWidth={2} icon={ScratchCardIcon} />
          <h1 className="sm:text-2xl text-xl font-light">
            {t("allTransactions")}
          </h1>
        </div>
        <div>
          {pages > 1 && (
            <Select
              value={String(currentPage)}
              onValueChange={(value: string) => handlePageChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={String(currentPage)} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                  <SelectItem key={page} value={page.toString()}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <TransactionTable
        householdId={householdId}
        transactions={currentShowingTransactions}
        members={members}
        currency={currencyCode}
        categories={categories}
      />
    </div>
  );
}
