"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Spacer } from "@/components/atoms/Spacer";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CategoriesOfExpanse,
  categoriesOfExpanse,
} from "@/drizzle/schema";
import {
  createCategory,
  updateCategory,
} from "@/features/categories/actions/category";
import {
  CategoryIcon,
  type CategoryIconKeys,
  icons,
} from "@/features/categories/components/CategoryIcon";
import {
  type CategorySchema,
  categorySchema,
} from "@/features/categories/schema/category";
import { performFormSubmitAction } from "@/global/functions";
import type { CategoryWithIcon } from "@/global/types";
import { cn } from "@/lib/utils";

export function CategoryForm({
  categoryType,
  category,
  householdId,
  onSuccess,
}: {
  categoryType: CategoriesOfExpanse;
  category?: CategoryWithIcon;
  householdId: string;
  onSuccess?: () => void;
}) {
  const t = useTranslations("Settings.categories");
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ?? {
      name: "",
      icon: "",
      categoryType,
    },
  });

  function onSubmit(data: CategorySchema) {
    startTransition(async () => {
      performFormSubmitAction(
        category
          ? () =>
              updateCategory(
                data,
                category.id,
                householdId,
                data.categoryType as CategoriesOfExpanse,
              )
          : () => createCategory(data, householdId),
        onSuccess,
      );
    });

    form.reset();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field className="grow" data-invalid={fieldState.invalid}>
            <Input placeholder={t("placeholders.name")} {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="categoryType"
        render={({ field, fieldState }) => (
          <Field className="w-full" data-invalid={fieldState.invalid}>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue>{t(`types.${field.value}`)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categoriesOfExpanse.map((type) => (
                  <SelectItem value={type} key={type}>
                    {t(`types.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Spacer color="bg-white" />
      <Controller
        control={form.control}
        name="icon"
        render={({ field, fieldState }) => (
          <Field className="flex w-full" data-invalid={fieldState.invalid}>
            <ul className="grid sm:grid-cols-10 grid-cols-5 gap-3 decoration-0 max-w-full">
              {Object.keys(icons)
                .filter((icon) => icon !== "default")
                .map((icon) => (
                  <Button
                    type="button"
                    variant="default"
                    size="icon-lg"
                    key={icon}
                    data-testid="category-icon-option"
                    onClick={() => {
                      form.setValue("icon", icon);
                    }}
                    className={cn(
                      "w-full",
                      field.value === icon ? "bg-primary" : "bg-secondary",
                    )}
                  >
                    <CategoryIcon categoryIconName={icon as CategoryIconKeys} />
                  </Button>
                ))}
            </ul>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        className="w-fit self-end"
        variant="default"
        type="submit"
        disabled={form.formState.isSubmitting || isPending}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
          {category ? t("save") : t("add")}
        </LoadingSwap>
      </Button>
    </form>
  );
}
