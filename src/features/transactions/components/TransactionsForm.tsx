"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionType as transactionTypes } from "@/drizzle/schema";
import {
  createTransaction,
  updateTransaction,
} from "@/features/transactions/actions/transactions";
import {
  type TransactionsSchema,
  transactionsSchema,
} from "@/features/transactions/schema/transactions";
import { performFormSubmitAction } from "@/global/functions";
import type { Category, Member, Transaction } from "@/global/types";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function TransactionForm({
  defaultTransactionType,
  members,
  categories,
  householdId,
  transaction,
  onUpdateSuccess,
}: {
  defaultTransactionType: string;
  members: Member[];
  categories: Category[];
  householdId: string;
  transaction?: Transaction;
  onUpdateSuccess?: () => void;
}) {
  const ts = useTranslations("CreateTransaction");
  const session = useSession();
  const [transactionType, setTransactionType] = useState(
    defaultTransactionType ?? "",
  );
  const [isPending, startTransition] = useTransition();

  const currentMember = transaction
    ? members.find((m) => m.id === transaction.memberId)
    : members.find((m) => m.user?.id === session.data?.user?.id);

  const incomeCategories = categories.filter(
    (category) => category.categoryType === "incomes",
  );

  const expenseCategories = categories.filter(
    (category) => category.categoryType !== "incomes",
  );

  const currentCategories =
    transactionType === "income" ? incomeCategories : expenseCategories;

  const form = useForm<TransactionsSchema>({
    resolver: zodResolver(transactionsSchema),
    defaultValues: transaction ?? {
      price: 0,
      name: "",
      type: transactionType,
      memberId: currentMember?.id ?? members[0]?.id,
      date: new Date(),
      categoryId: undefined,
    },
  });

  async function onSubmit(data: TransactionsSchema) {
    startTransition(async () => {
      await performFormSubmitAction(
        () =>
          transaction
            ? updateTransaction(
                transaction.id,
                {
                  ...data,
                  type: transactionType,
                },
                householdId,
              )
            : createTransaction(
                { ...data, type: transactionType },
                householdId,
              ),
        undefined,
        transaction
          ? "transaction-update-success-toast"
          : "transaction-create-success-toast",
      );
      onUpdateSuccess?.();
    });

    form.resetField("name");
    form.resetField("price");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="flex justify-center items-center gap-2 w-full sm:flex-nowrap sm:flex-row flex-col-reverse flex-wrap">
        <Controller
          control={form.control}
          name="price"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{ts("price")}</FieldLabel>
              <Input
                id={field.name}
                data-testid="transaction-price"
                min={0}
                type="number"
                step="0.01"
                aria-invalid={fieldState.invalid}
                {...field}
                onFocus={(e) => {
                  if (e.target.value === "0.00" || e.target.value === "0") {
                    e.target.value = "";
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value.replace(",", ".");
                  e.target.value = Number(value).toFixed(2);
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-col gap-2">
          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="opacity-0">
                  t
                </FieldLabel>
                <div className="flex gap-2 justify-center">
                  {transactionTypes.map((t) => (
                    <Button
                      key={t}
                      className={cn(
                        "bg-card hover:bg-muted-foreground text-white/20 hover:text-foreground px-3",
                        field.value === t &&
                          "bg-primary hover:bg-primary text-foreground",
                      )}
                      type="button"
                      onClick={() => {
                        setTransactionType(t);
                        field.onChange(t);
                        form.resetField("categoryId");
                      }}
                    >
                      {ts(`transactionTypes.${t}`)}
                    </Button>
                  ))}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{ts("name.label")}</FieldLabel>
            <Input
              id={field.name}
              placeholder={ts("name.placeholder")}
              data-testid="transaction-name"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex gap-2">
        <Controller
          control={form.control}
          name="memberId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{ts("member")}</FieldLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.name}
                  className="w-full truncate"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder={currentMember?.name}>
                    {(value) =>
                      members.find((m) => m.id === value)?.name ??
                      currentMember?.name
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem value={member.id} key={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div>
          <Controller
            control={form.control}
            name="date"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{ts("dateLabel")}</FieldLabel>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        id={field.name}
                        className="w-35"
                        variant="outline"
                        aria-invalid={fieldState.invalid}
                      >
                        {format(field.value, "dd/MM/yyyy")}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (!date) {
                          return;
                        }
                        const utcDate = new Date(
                          Date.UTC(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                          ),
                        );
                        field.onChange(utcDate);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
      <Controller
        control={form.control}
        name="categoryId"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{ts("category.label")}</FieldLabel>
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger
                id={field.name}
                className="w-full"
                data-testid="transaction-category-select"
                aria-invalid={fieldState.invalid}
              >
                <SelectValue placeholder={ts("category.placeholder")}>
                  {(value) =>
                    currentCategories.find((c) => c.id === value)?.name ??
                    ts("category.placeholder")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {currentCategories.map((category) => (
                  <SelectItem
                    value={category.id}
                    key={category.id}
                    data-testid="transaction-category-option"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex justify-center pt-3.5">
        <Button
          data-testid={
            transaction
              ? "transaction-edit-submit"
              : "transaction-create-submit"
          }
          variant="default"
          type="submit"
          disabled={form.formState.isSubmitting || isPending}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
            {transaction ? ts("save") : ts("submit")}
          </LoadingSwap>
        </Button>
      </div>
    </form>
  );
}
