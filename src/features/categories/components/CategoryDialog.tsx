"use client";
import { PencilEdit02Icon, Plus } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/organisms/ResponsiveDialog";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import type { CategoryWithIcon } from "@/global/types";

export function CategoryDialog({
  category,
  householdId,
  triggerTestId,
}: {
  category: CategoryWithIcon;
  householdId: string;
  triggerTestId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Settings.categories");
  return (
    <ResponsiveDialog
      open={isOpen}
      setIsOpen={setIsOpen}
      triggerTitle={category ? undefined : t("add")}
      title={category ? t("edit") : t("add")}
      icon={category ? PencilEdit02Icon : Plus}
      testId="category-add-button"
      buttonVariant={category ? "outline" : "default"}
      triggerTestId={triggerTestId ?? `category-edit-btn-${category.id}`}
    >
      <CategoryForm
        category={category}
        householdId={householdId}
        onSuccess={() => setIsOpen(false)}
        categoryType={category.categoryType}
      />
    </ResponsiveDialog>
  );
}
