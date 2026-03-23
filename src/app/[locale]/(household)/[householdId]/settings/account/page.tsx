import { GlobalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { LanguageSelect } from "@/components/atoms/LanguageSelect";
import { MobileTopHeader } from "@/components/atoms/MobileTopHeader";
import { SignOutButton } from "@/components/atoms/SignOutButton";
import { UserAvatar } from "@/components/atoms/UserAvatar";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { SettingsNavigationBar } from "@/components/organisms/SettingsNavigationBar";
import { HouseholdLinkGenerate } from "@/features/household/components/HouseholdLinkGenerate";
import { canAccessHouseholdSettings } from "@/features/household/permissions/household";
import { UserForm } from "@/features/users/components/UserForm";
import { getHousehold } from "@/global/actions";
import { auth } from "@/lib/auth";

export default async function HouseholdAccountSettings({
  params,
}: {
  params: Promise<{ householdId: string }>;
}) {
  const locale = await getLocale();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { householdId } = await params;
  const household = await getHousehold(householdId);
  const t = await getTranslations("Settings.account");

  if (!household || !session) notFound();

  return (
    <>
      <MobileTopHeader title={t("title")}>
        <HouseholdLinkGenerate
          url={process.env.FRONTEND_URL!}
          householdId={householdId}
          link={household.invite?.link ?? ""}
        />
      </MobileTopHeader>
      <div className="flex flex-col gap-10 sm:gap-5">
        <div className="hidden sm:flex">
          <SectionHeader title={t("title")} description={t("description")} />
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-5">
          <div className="md:bg-transparent bg-[#212122] p-2.5 rounded-lg w-full">
            <UserForm user={session.user} />
          </div>
          <Suspense fallback={<div className="bg-gray-600 size-20"></div>}>
            <div>
              <UserAvatar className="size-20" image={session.user.image} />
            </div>
          </Suspense>
        </div>
        <div className="flex flex-col gap-2 sm:hidden">
          <SectionHeader title={t("contain")} />
          <div className="bg-[#212122] p-2.5 rounded-lg">
            <SettingsNavigationBar
              canAccessHouseholdSettings={
                await canAccessHouseholdSettings(householdId)
              }
              householdId={householdId}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <SectionHeader title={t("preferences")} />
          <div className="flex justify-between items-center w-full md:bg-transparent bg-[#212122] px-2 py-1 rounded-lg">
            <div className="flex items-center gap-2 h-full">
              <HugeiconsIcon size={20} icon={GlobalIcon} />
              <p>{t("language")}</p>
            </div>
            <LanguageSelect currentLocale={locale} />
          </div>
        </div>
        <div className="sm:hidden flex">
          <SignOutButton />
        </div>
      </div>
    </>
  );
}
