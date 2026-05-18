"use client";
import { PencilEdit02Icon, Plus } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/organisms/ResponsiveDialog";
import { TransactionForm } from "@/features/transactions/components/TransactionsForm";
import type { Category, Member, Transaction } from "@/global/types";

export function TransactionDialog({
  defaultTransactionType,
  householdId,
  transaction,
  categories,
  members,
}: {
  defaultTransactionType: string;
  householdId: string;
  transaction?: Transaction;
  categories: Category[];
  members: Member[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("TransactionDialog");

  return (
    <ResponsiveDialog
      testId={
        transaction ? "edit-transaction-dialog" : "create-transaction-dialog"
      }
      open={isOpen}
      setIsOpen={setIsOpen}
      icon={transaction ? PencilEdit02Icon : Plus}
      triggerTitle={transaction ? undefined : t("add")}
      title={transaction ? t("edit") : t("add")}
      buttonVariant={transaction ? "outline" : "default"}
      triggerTestId={
        transaction
          ? "transaction-edit-btn"
          : `add-transaction-btn-${defaultTransactionType}`
      }
      mobileButtonVariant="outline"
      hideTriggerTitleOnMobile
      mobileTriggerClassName="h-full w-[90px]"
    >
      <TransactionForm
        householdId={householdId}
        categories={categories}
        members={members}
        transaction={transaction}
        defaultTransactionType={defaultTransactionType}
        onUpdateSuccess={transaction && (() => setIsOpen(false))}
      />
    </ResponsiveDialog>
  );
}
