"use client";
import { useTranslations } from "next-intl";
import { cloneElement, isValidElement, type ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberForm } from "@/features/members/components/MemberForm";
import type { Member } from "@/global/types";

export function MemberDialog({
  children,
  member,
  householdId,
  triggerTestId,
}: {
  children: ReactNode;
  member?: Member;
  householdId: string;
  triggerTestId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Settings.household.members");
  const trigger =
    triggerTestId && isValidElement(children)
      ? cloneElement(children, { "data-testid": triggerTestId })
      : children;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {member ? (
              <p>
                {t("edit")} {member.name}
              </p>
            ) : (
              t("add")
            )}
          </DialogTitle>
        </DialogHeader>
        <MemberForm
          householdId={householdId}
          member={member}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
