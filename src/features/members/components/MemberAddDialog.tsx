"use client";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberForm } from "@/features/members/components/MemberForm";

export function MemberAddDialog({
  children,
  householdId,
}: {
  children: ReactNode;
  householdId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Settings.household.members");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add")}</DialogTitle>
        </DialogHeader>
        <MemberForm
          householdId={householdId}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
