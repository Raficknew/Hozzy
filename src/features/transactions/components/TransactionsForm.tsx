"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
      memberId: currentMember?.id ?? undefined,
      date: new Date(),
      categoryId: undefined,
    },
  });

  async function onSubmit(data: TransactionsSchema) {
    startTransition(async () => {
      await performFormSubmitAction(() =>
        transaction
          ? updateTransaction(
              transaction.id,
              {
                ...data,
                type: transactionType,
              },
              householdId,
            )
          : createTransaction({ ...data, type: transactionType }, householdId),
      );
      onUpdateSuccess?.();
    });

    form.resetField("name");
    form.resetField("price");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="flex justify-center items-center gap-2 w-full sm:flex-nowrap sm:flex-row flex-col-reverse flex-wrap">
          <div className="w-full">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("price")}</FormLabel>
                  <FormControl>
                    <Input
                      min={0}
                      type="number"
                      step="0.01"
                      {...field}
                      onFocus={(e) => {
                        if (
                          e.target.value === "0.00" ||
                          e.target.value === "0"
                        ) {
                          e.target.value = "";
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value.replace(",", ".");
                        e.target.value = Number(value).toFixed(2);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="opacity-0">t</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 justify-center">
                      {transactionTypes.map((t) => (
                        <Button
                          key={t}
                          className={cn(
                            "bg-card hover:bg-[#747474] text-white/20 hover:text-foreground px-3",
                            field.value === t &&
                              "bg-accent hover:bg-accent text-foreground",
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ts("name.label")}</FormLabel>
              <FormControl>
                <Input placeholder={ts("name.placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <div className="w-full">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("member")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full truncate">
                        <SelectValue placeholder={currentMember?.name} />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem value={member.id} key={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{ts("dateLabel")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button className="w-35" variant="datePicker">
                          {format(field.value, "dd/MM/yyyy")}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ts("category.label")}</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={ts("category.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategories.map((category) => (
                      <SelectItem value={category.id} key={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center pt-3.5">
          <Button
            variant="submit"
            type="submit"
            disabled={form.formState.isSubmitting || isPending}
          >
            <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
              {transaction ? ts("save") : ts("submit")}
            </LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}
