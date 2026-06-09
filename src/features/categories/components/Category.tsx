"use client";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ActionButton } from "@/components/atoms/ActionButton";
import { deleteCategory } from "@/features/categories/actions/category";
import { CategoryDialog } from "@/features/categories/components/CategoryDialog";
import { CategoryIcon } from "@/features/categories/components/CategoryIcon";
import type { CategoryWithIcon } from "@/global/types";
import type { CategoryIconKeys } from "../types/icons";

export function Category({
  category,
  householdId,
}: {
  category: CategoryWithIcon;
  householdId: string;
}) {
  return (
    <div className="flex items-center w-full justify-between">
      <div className="flex items-center gap-2">
        <CategoryIcon categoryIconName={category.icon as CategoryIconKeys} />
        <p>{category.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <CategoryDialog
          householdId={householdId}
          category={category}
          triggerTestId={`category-edit-btn-${category.id}`}
        />

        <ActionButton
          action={() => deleteCategory(category.id, householdId)}
          requireAreYouSure
          variant="destructive"
          size="lg"
          data-testid={`category-delete-btn-${category.id}`}
        >
          <HugeiconsIcon size={20} icon={Cancel01Icon} />
        </ActionButton>
      </div>
    </div>
  );
}
