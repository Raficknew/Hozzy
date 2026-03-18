"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "better-auth";
import { notFound } from "next/navigation";
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
import { updateUser } from "@/features/users/actions/users";
import { type UsersSchema, usersSchema } from "@/features/users/schema/users";
import { performFormSubmitAction } from "@/global/functions";

export function UserForm({ user }: { user: User }) {
  if (!user) notFound();

  const t = useTranslations("Settings.account");
  const [isPending, startTransition] = useTransition();

  const form = useForm<UsersSchema>({
    resolver: zodResolver(usersSchema),
    defaultValues: {
      name: user.name ?? "",
    },
  });

  async function onSubmit(data: UsersSchema) {
    if (!user) return;

    startTransition(async () => {
      await performFormSubmitAction(() => updateUser(data, user.id!));
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full flex flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("label")}</FormLabel>
              <FormControl>
                <Input className="bg-[#161616]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="self-end w-full sm:w-fit"
          variant="submit"
          type="submit"
          disabled={form.formState.isSubmitting || isPending}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
            {t("save")}
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
