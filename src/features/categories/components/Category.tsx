"use client";
import { Cancel01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ActionButton } from "@/components/atoms/ActionButton";
import { DialogTrigger } from "@/components/ui/dialog";
import { deleteCategory } from "@/features/categories/actions/category";
import { CategoryEditDialog } from "@/features/categories/components/CategoryEditDialog";
import {
  CategoryIcon,
  type CategoryIconKeys,
} from "@/features/categories/components/CategoryIcon";
import type { CategoryWithIcon } from "@/global/types";

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
      <div className="flex items-center gap-6">
        <CategoryEditDialog householdId={householdId} category={category}>
          <DialogTrigger className="cursor-pointer">
            <HugeiconsIcon size={20} icon={PencilEdit02Icon} />
          </DialogTrigger>
        </CategoryEditDialog>

        <ActionButton
          action={() => deleteCategory(category.id, householdId)}
          requireAreYouSure
          variant="destructive"
        >
          <HugeiconsIcon size={20} icon={Cancel01Icon} />
        </ActionButton>
      </div>
    </div>
  );
}
