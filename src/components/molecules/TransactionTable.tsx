"use client";
import { Cancel01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Price } from "@/components/atoms/Price";
import { UserAvatar } from "@/components/atoms/UserAvatar";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTransaction } from "@/features/transactions/actions/transactions";
import { TransactionDialog } from "@/features/transactions/components/TransactionDialog";
import type { Category, Member, Transaction } from "@/global/types";
import { useFormattedDate } from "@/lib/formatters";

export function TransactionTable({
  transactions,
  members,
  currency,
  householdId,
  categories,
}: {
  transactions: Transaction[];
  members: Member[];
  currency: string;
  householdId: string;
  categories: Category[];
}) {
  const t = useTranslations("TransactionTable");
  const { formatDate } = useFormattedDate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("actions")}</TableHead>
          <TableHead>{t("name")}</TableHead>
          <TableHead>{t("date")}</TableHead>
          <TableHead>{t("member")}</TableHead>
          <TableHead>{t("category")}</TableHead>
          <TableHead>{t("type")}</TableHead>
          <TableHead className="text-right">{t("price")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="flex gap-2">
              <TransactionDialog
                householdId={householdId}
                transaction={transaction}
                defaultTransactionType={transaction.type}
                members={members}
                categories={categories}
              >
                <DialogTrigger>
                  <HugeiconsIcon
                    className="cursor-pointer"
                    icon={PencilEdit02Icon}
                  />
                </DialogTrigger>
              </TransactionDialog>
              <ActionButton
                action={() => deleteTransaction(transaction.id, householdId)}
                requireAreYouSure
                variant="destructive"
              >
                <HugeiconsIcon icon={Cancel01Icon} />
              </ActionButton>
            </TableCell>
            <TableCell className="font-medium">{transaction.name}</TableCell>
            <TableCell>{formatDate(transaction.date)}</TableCell>
            <TableCell>
              {(() => {
                const memberId = transaction.memberId;
                const member = members.find((m) => m.id === memberId);
                return member ? (
                  <div className="flex items-center gap-2">
                    <UserAvatar image={member.user?.image} />
                    {member.name}
                  </div>
                ) : (
                  "Brak"
                );
              })()}
            </TableCell>
            <TableCell>{transaction.categoryName}</TableCell>
            <TableCell>{t(transaction.type)}</TableCell>
            <TableCell className="text-right">
              {(() => {
                const isIncome = transaction.type === "income";
                const sign = isIncome ? "+" : "-";
                const color = isIncome ? "text-green-400" : "text-red-400";

                return (
                  <div className={color}>
                    <span className="inline-block">{sign}</span>
                    <Price
                      className="inline-block"
                      currency={currency}
                      price={transaction.price}
                    />
                  </div>
                );
              })()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
