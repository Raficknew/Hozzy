"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
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
  let category = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId, categories]);
  const t = useTranslations("AnalyticsPage");
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (selectedCategory: Category) => {
    category = selectedCategory;

    const params = new URLSearchParams(searchParams.toString());
    params.set("categoryId", category.id);
    push(`?${params.toString()}`);
  };

  const gradient =
    category?.categoryType === "incomes"
      ? "radial-gradient(ellipse at right, #00C48C30 0%, #21212266 100%)"
      : "radial-gradient(ellipse at right, #F83B3B4D 0%, #21212266 100%)";

  return (
    <Card className="w-full md:w-1/3 min-w-[200px] relative overflow-hidden">
      <CardHeader className="relative z-10">
        <CardTitle>{t("category")}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 items-center relative z-10">
        <div className="p-5 rounded-full bg-primary">
          <CategoryIcon categoryIconName={category?.icon as CategoryIconKeys} />
        </div>
        <article className="flex flex-col gap-1 flex-1">
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
          <h3
            className={
              category?.categoryType === "incomes"
                ? "text-green-500 font-medium"
                : "text-red-500 font-medium"
            }
          >
            {category?.categoryType && t(`${category?.categoryType}`)}
          </h3>
        </article>
      </CardContent>

      {category && (
        <div
          className="absolute inset-0 z-0 w-full h-full pointer-events-none"
          style={{
            background: gradient,
            opacity: 1,
          }}
        />
      )}
    </Card>
  );
}
