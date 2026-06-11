"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CategoryIcon } from "@/features/categories/components/CategoryIcon";
import type { CategoryIconKeys } from "@/features/categories/types/icons";
import type { Category } from "@/global/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CategorySelect({
  categories,
  selectedCategoryId,
}: {
  categories: Category[];
  selectedCategoryId?: string | null;
}) {
  const [category, setCategory] = useState<Category | null>(
    categories.find((c) => c.id === selectedCategoryId) || null,
  );
  const t = useTranslations("AnalyticsPage");
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: Category) => {
    setCategory(category);

    const params = new URLSearchParams(searchParams.toString());
    params.set("categoryId", category.id);
    push(`?${params.toString()}`);
  };

  return (
    <Card className="w-1/4">
      <CardHeader>
        <CardTitle>{t("category")}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 items-center">
        <div className="p-5 rounded-full bg-primary">
          <CategoryIcon categoryIconName={category?.icon as CategoryIconKeys} />
        </div>
        <article className="flex flex-col gap-1">
          <Select
            value={category}
            onValueChange={(category) => {
              if (category) {
                handleCategoryChange(category);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category">
                {category?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <h3>{category?.categoryType && t(`${category?.categoryType}`)}</h3>
        </article>
      </CardContent>
    </Card>
  );
}
