"use client";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CategoriesOfExpanse } from "@/drizzle/schema";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import type { CategoryWithIcon } from "@/global/types";

export function CategoryEditDialog({
  children,
  category,
  householdId,
}: {
  children: ReactNode;
  category: CategoryWithIcon;
  householdId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Settings.categories");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("edit")} {category.name}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          householdId={householdId}
          category={category}
          onSuccess={() => setIsOpen(false)}
          categoryType={category.categoryType as CategoriesOfExpanse}
        />
      </DialogContent>
    </Dialog>
  );
}
