"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 text-right"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("name.label")}</FieldLabel>
            <Input
              id={field.name}
              placeholder={t("name.placeholder")}
              data-testid="household-name"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("description.label")}
            </FieldLabel>
            <Input
              id={field.name}
              placeholder={t("description.placeholder")}
              data-testid="household-description"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {household == null && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Controller
            control={form.control}
            name="currencyCode"
            render={({ field, fieldState }) => (
              <Field
                className="w-full sm:w-38.75"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor={field.name}>
                  {t("currency.label")}
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={field.name}
                    className="w-full sm:w-38.75"
                    data-testid="household-currency"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder={t("currency.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem
                        key={currency.code}
                        value={currency.code}
                        data-testid={`household-currency-option-${currency.code.toLowerCase()}`}
                      >
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="balance"
            render={({ field, fieldState }) => (
              <Field className="w-full" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("balance.label")}
                </FieldLabel>
                <Input
                  id={field.name}
                  min={0}
                  type="number"
                  step="0.01"
                  data-testid="household-balance"
                  aria-invalid={fieldState.invalid}
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      )}
      <Button
        variant="default"
        className={cn("mt-2", household ? "" : "w-full")}
        type="submit"
        data-testid="household-submit"
        disabled={form.formState.isSubmitting || isPending}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
          {household ? t("save") : t("submit")}
        </LoadingSwap>
      </Button>
    </form>
  );
}
