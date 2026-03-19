"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  createHousehold,
  updateHousehold,
} from "@/features/household/actions/household";
import {
  type HouseholdSchema,
  householdSchema,
} from "@/features/household/schema/household";
import { performFormSubmitAction } from "@/global/functions";
import { cn } from "@/lib/utils";

export function HouseholdForm({
  currencies,
  household,
}: {
  currencies: { code: string }[];
  household?: {
    id: string;
    name: string;
    description: string;
    currencyCode: string;
    balance: number;
  };
}) {
  const t = useTranslations("CreateHousehold");
  const [isPending, startTransition] = useTransition();

  const form = useForm<HouseholdSchema>({
    resolver: zodResolver(householdSchema),
    defaultValues: household ?? {
      name: "",
      description: "",
      currencyCode: "",
      balance: 0,
    },
  });

  function onSubmit(data: HouseholdSchema) {
    startTransition(async () => {
      performFormSubmitAction(
        household
          ? () => updateHousehold(data, household.id)
          : () => createHousehold(data),
      );
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grow w-full space-y-4 text-right"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name.label")}</FormLabel>
              <FormControl>
                <Input
                  className={household && "bg-[#161616]"}
                  placeholder={t("name.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description.label")}</FormLabel>
              <FormControl>
                <Input
                  className={household && "bg-[#161616]"}
                  placeholder={t("description.placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {household == null && (
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem className="w-full sm:w-38.75">
                  <FormLabel>{t("currency.label")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full sm:w-38.75">
                        <SelectValue placeholder={t("currency.placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("balance.label")}</FormLabel>
                  <FormControl>
                    <Input
                      min={0}
                      type="number"
                      step="0.01"
                      {...field}
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          e.target.value = "";
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value.replace(",", ".");
                        e.target.value = Number(value).toFixed(2);
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <Button
          variant="submit"
          className={cn("mt-2", household ? "" : "w-full")}
          type="submit"
          disabled={form.formState.isSubmitting || isPending}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
            {household ? t("save") : t("submit")}
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
