"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/features/transactions/components/TransactionsForm";
import type { Category, Member, Transaction } from "@/global/types";

export function TransactionDialog({
  defaultTransactionType,
  householdId,
  children,
  transaction,
  categories,
  members,
}: {
  defaultTransactionType: string;
  householdId: string;
  children: React.ReactNode;
  transaction?: Transaction;
  categories: Category[];
  members: Member[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent
        data-testid={
          transaction ? "edit-transaction-dialog" : "create-transaction-dialog"
        }
      >
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <TransactionForm
          householdId={householdId}
          categories={categories}
          members={members}
          transaction={transaction}
          defaultTransactionType={defaultTransactionType}
          onUpdateSuccess={transaction && (() => setIsOpen(false))}
        />
      </DialogContent>
    </Dialog>
  );
}
