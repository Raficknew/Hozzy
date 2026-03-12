"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoadingSwap } from "@/components/atoms/LoadingSwap";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex md:flex-col gap-2 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grow">
                <FormControl>
                  <Input
                    className="bg-[#161616]"
                    placeholder={t("placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              variant="submit"
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
      </Form>
    </div>
  );
}
