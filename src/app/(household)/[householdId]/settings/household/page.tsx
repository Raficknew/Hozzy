import { Delete02Icon, PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ActionButton } from "@/components/atoms/ActionButton";
import { MobileTopHeader } from "@/components/atoms/MobileTopHeader";
import { Spacer } from "@/components/atoms/Spacer";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { DialogTrigger } from "@/components/ui/dialog";
import { deleteHousehold } from "@/features/household/actions/household";
import { HouseholdForm } from "@/features/household/components/HouseholdGeneralForm";
import { assertHouseholdWriteAccess } from "@/features/household/permissions/household";
import { Member } from "@/features/members/components/Member";
import { MemberAddDialog } from "@/features/members/components/MemberAddDialog";
import { MemberForm } from "@/features/members/components/MemberForm";
import { getCurrencies, getHousehold, getMembers } from "@/global/actions";
import { MAX_MEMBERS_PER_HOUSEHOLD } from "@/global/limits";

export default async function HouseholdEditPage({
  params,
}: {
  params: Promise<{ householdId: string }>;
}) {
  const { householdId } = await params;
  const household = await getHousehold(householdId);
  const currencies = await getCurrencies();
  const members = await getMembers(householdId);
  const t = await getTranslations("Settings.household");

  if (household == null || (await assertHouseholdWriteAccess(householdId)))
    notFound();

  return (
    <>
      <MobileTopHeader title={t("mobileTitle")}>
        <ActionButton
          variant="ghostDestructive"
          action={deleteHousehold.bind(null, householdId)}
          requireAreYouSure
        >
          <HugeiconsIcon
            strokeWidth={2}
            width={10}
            height={10}
            icon={Delete02Icon}
          />
        </ActionButton>
      </MobileTopHeader>
      <div className="flex flex-col md:gap-4 gap-2">
        <div>
          <div className="sm:hidden mb-2">
            <SectionHeader title={t("informations")} />
          </div>
          <div className="bg-sidebar sm:p-0 p-5 rounded-xl">
            <HouseholdForm
              currencies={currencies}
              household={{
                id: household.id,
                currencyCode: household.currencyCode,
                description: household.description ?? "",
                name: household.name,
                balance: 0,
              }}
            />
          </div>
        </div>
        <Spacer />
        <div className="flex flex-col md:gap-5 gap-2">
          <SectionHeader
            title={t("members.title")}
            description={t("members.description")}
          />
          <div className="md:hidden">
            <MemberForm householdId={householdId} />
          </div>
          <div className="grid md:grid-cols-4 xl:grid-cols-8 gap-2">
            {members.map((member) => (
              <Member
                key={member.id}
                member={member}
                householdId={householdId}
                ownerId={household.ownerId}
              />
            ))}
            {members.length < MAX_MEMBERS_PER_HOUSEHOLD && (
              <MemberAddDialog householdId={householdId}>
                <DialogTrigger className="md:flex flex-col items-center justify-center h-[184px] hidden rounded-lg ring ring-accent cursor-pointer">
                  <HugeiconsIcon
                    className="size-12 text-accent"
                    icon={PlusSignCircleIcon}
                  />
                </DialogTrigger>
              </MemberAddDialog>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
