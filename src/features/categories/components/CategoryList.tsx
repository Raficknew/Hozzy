"use client";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Spacer } from "@/components/atoms/Spacer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  type CategoriesOfExpanse,
  categoriesOfExpanse,
} from "@/drizzle/schema/category";
import { Category } from "@/features/categories/components/Category";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import type { CategoryIconKeys } from "@/features/categories/components/CategoryIcon";
import { MAX_CATEGORIES_PER_HOUSEHOLD } from "@/global/limits";
import type { CategoryWithIcon } from "@/global/types";
import { cn } from "@/lib/utils";

export function CategoryList({
  categories,
  householdId,
}: {
  categories: CategoryWithIcon[];
  householdId: string;
}) {
  const [currentCategoryType, setCurrentCategoryType] = useState("fixed");
  const filteredCategories = categories.filter(
    (category) => category.categoryType === currentCategoryType,
  );
  const t = useTranslations("Settings.categories");

  return (
    <div className="flex flex-col gap-4 bg-sidebar p-2 rounded-lg">
      <div className="sm:grid sm:grid-cols-4 text-center w-full hide-scrollbar-mobile overflow-auto whitespace-nowrap sm:space-x-0 sm:gap-4 space-x-2 ">
        {categoriesOfExpanse.map((categoryType) => (
          <button
            type="button"
            className={cn(
              "cursor-pointer py-1 inline-block sm:w-full w-1/3",
              currentCategoryType === categoryType &&
                "border-b-2 rounded-sm border-[#9B8DF8] text-[#9B8DF8]",
            )}
            onClick={() => {
              if (currentCategoryType !== categoryType) {
                setCurrentCategoryType(categoryType);
              }
            }}
            key={categoryType}
          >
            {t(`types.${categoryType}`)}
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {filteredCategories.map((category) => (
          <div key={category.id} className="flex flex-col gap-2">
            <Category
              category={{
                ...category,
                icon: category.icon as CategoryIconKeys,
              }}
              householdId={householdId}
            />
            {filteredCategories[filteredCategories.indexOf(category) + 1] && (
              <Spacer />
            )}
          </div>
        ))}
      </div>

      {categories.length < MAX_CATEGORIES_PER_HOUSEHOLD && (
        <AddCategoryButton
          category={currentCategoryType as CategoriesOfExpanse}
          householdId={householdId}
        />
      )}
    </div>
  );
}

function AddCategoryButton({
  householdId,
  category,
}: {
  householdId: string;
  category: CategoriesOfExpanse;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Settings.categories");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="self-center cursor-pointer">
        <div className="flex items-center gap-2 bg-accent sm:px-4 px-2.5 py-2.5 rounded-lg">
          <HugeiconsIcon
            strokeWidth={2}
            width={15}
            height={15}
            icon={PlusSignIcon}
          />
          <p className="text-sm font-semibold">{t("add")}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add")}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden"></DialogDescription>
        <CategoryForm
          householdId={householdId}
          onSuccess={() => setIsOpen(false)}
          categoryType={category}
        />
      </DialogContent>
    </Dialog>
  );
}
