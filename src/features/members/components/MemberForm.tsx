"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createMember, updateMember } from "@/features/members/actions/members";
import {
  type MembersSchema,
  membersSchema,
} from "@/features/members/schema/members";
import { performFormSubmitAction } from "@/global/functions";
export function MemberForm({
  householdId,
  member,
  onSuccess,
}: {
  householdId: string;
  member?: { id: string; name: string };
  onSuccess?: () => void;
}) {
  const t = useTranslations("Settings.household.members");
  const [isPending, startTransition] = useTransition();
  const form = useForm<MembersSchema>({
    resolver: zodResolver(membersSchema),
    defaultValues: member ?? {
      name: "",
    },
  });

  function onSubmit(data: MembersSchema) {
    startTransition(async () => {
      performFormSubmitAction(
        member
          ? () => updateMember(data, member.id, householdId)
          : () => createMember(data, householdId),
        onSuccess,
      );
    });

    form.resetField("name");
  }

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex md:flex-col gap-2 w-full"
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="grow" data-invalid={fieldState.invalid}>
              <Input
                id={field.name}
                placeholder={t("placeholder")}
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <DialogFooter>
          <Button
            variant="default"
            type="submit"
            disabled={form.formState.isSubmitting || isPending}
          >
            <LoadingSwap isLoading={form.formState.isSubmitting || isPending}>
              <p className="md:flex hidden">
                {member ? t("save") : t("submit")}
              </p>
              <HugeiconsIcon
                className="cursor-pointer sm:size-6 size-5 md:hidden"
                icon={PlusSignIcon}
              />
            </LoadingSwap>
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
}
