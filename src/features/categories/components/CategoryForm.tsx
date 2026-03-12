"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Spacer } from "@/components/atoms/Spacer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grow">
                <FormControl>
                  <Input
                    className="bg-[#212122]"
                    placeholder={t("placeholders.name")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full bg-[#212122]">
                      <SelectValue placeholder="Wybierz nadkategorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesOfExpanse.map((type) => (
                        <SelectItem value={type} key={type}>
                          {t(`types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Spacer color="bg-white" />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="grid sm:grid-cols-10 grid-cols-5 gap-3">
                    {Object.keys(icons)
                      .filter((icon) => icon !== "default")
                      .map((icon) => (
                        <button
                          type="button"
                          key={icon}
                          onClick={() => {
                            form.setValue("icon", icon);
                          }}
                          className={cn(
                            "flex justify-center p-2 rounded-lg cursor-pointer",
                            field.value === icon ? "bg-accent" : "bg-[#212122]",
                          )}
                        >
                          <CategoryIcon
                            size={20}
                            categoryIconName={icon as CategoryIconKeys}
                          />
                        </button>
                      ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-fit self-end"
            variant="submit"
            disabled={form.formState.isSubmitting || isPending}
          >
            <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
              {category ? t("save") : t("add")}
            </LoadingSwap>
          </Button>
        </form>
      </Form>
    </div>
  );
}
