"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/global/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CategorySelect({ categories }: { categories: Category[] }) {
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const { push } = useRouter();
  const defaultCategoryName = useSearchParams().get("category");

  if (defaultCategoryName != null && categoryName === null) {
    setCategoryName(defaultCategoryName);
  }

  const handleCategoryChange = (value: string) => {
    setCategoryName(value);

    const searchParams = new URLSearchParams();
    searchParams.set("category", value ?? "");
    push(`?${searchParams}`);
  };

  return (
    <Select
      value={categoryName}
      onValueChange={(value) => {
        if (value) {
          handleCategoryChange(value);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
