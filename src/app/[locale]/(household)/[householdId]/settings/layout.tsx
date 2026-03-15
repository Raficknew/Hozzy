import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { ActionButton } from "@/components/atoms/ActionButton";
import { SettingsNavigationBar } from "@/components/organisms/SettingsNavigationBar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { deleteHousehold } from "@/features/household/actions/household";
import { HouseholdLinkGenerate } from "@/features/household/components/HouseholdLinkGenerate";
import { canAccessHouseholdSettings } from "@/features/household/permissions/household";
import { getHousehold } from "@/global/actions";
import { auth } from "@/lib/auth";

export default async function HouseholdSettingsLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ householdId: string }>;
}>) {
  const session = await auth();

  if (session == null) redirect(`/sign-in`);

  const { householdId } = await params;
  const household = await getHousehold(householdId);

  if (!household) notFound();

  if (
    household == null ||
    !household?.members.find((member) => member.userId === session.user.id)
  )
    redirect(`/`);

  return (
    <>
      <Sidebar />
      <div className="flex flex-col h-screen gap-3 sm:pl-22 sm:pr-4 py-3 w-full">
        <TopBar householdId={householdId} link={household.invite?.link ?? ""} />
        <div className="sm:bg-sidebar w-full h-full rounded-xl p-5 flex flex-col items-center ">
          <div className="w-full sm:w-3/4 pb-[80px] sm:pb-0">{children}</div>
        </div>
      </div>
    </>
  );
}

async function TopBar({
  householdId,
  link,
}: {
  householdId: string;
  link: string;
}) {
  const t = await getTranslations("Settings");
  return (
    <div className="bg-sidebar rounded-xl p-3 flex-col gap-5 hidden sm:flex">
      <div className="flex justify-between">
        <h1 className="text-2xl">{t("title")}</h1>
        <HouseholdLinkGenerate
          url={process.env.FRONTEND_URL!}
          householdId={householdId}
          link={link}
        />
      </div>
      <div className="flex justify-between">
        <SettingsNavigationBar
          canAccessHouseholdSettings={
            await canAccessHouseholdSettings(householdId)
          }
          householdId={householdId}
        />
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
          <p className="text-xs">{t("household.delete")}</p>
        </ActionButton>
      </div>
    </div>
  );
}
