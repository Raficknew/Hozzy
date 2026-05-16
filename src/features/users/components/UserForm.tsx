"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "better-auth";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 w-full flex flex-col"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{t("label")}</FieldLabel>
            <Input
              id={field.name}
              className="bg-[#161616]"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        className="self-end w-full sm:w-fit"
        variant="default"
        type="submit"
        disabled={form.formState.isSubmitting || isPending}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
          {t("save")}
        </LoadingSwap>
      </Button>
    </form>
  );
}
