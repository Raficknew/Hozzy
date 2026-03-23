import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";
import { HouseholdJoinButton } from "@/features/household/components/HouseholdJoinButton";
import { getHousehold } from "@/global/actions";
import { auth } from "@/lib/auth";

export default async function HouseholdJoinPage({
  params,
}: {
  params: Promise<{ householdId: string; link: string }>;
}) {
  const { householdId, link } = await params;
  const household = await getHousehold(householdId);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("JoinPage");

  if (
    household == null ||
    household.invite?.link !== link ||
    !session?.user.id
  ) {
    notFound();
  }

  if (household.members.find((u) => u.userId === session.user.id)) {
    redirect(`/${householdId}`);
  }

  return (
    <div className="flex justify-center items-center h-screen px-2">
      <HozzyLogo link variant="withText" size={90} />

      <div className="flex flex-col gap-3 w-[450px] text-center">
        <span className="text-3xl text-center">
          {t("title")}
          <p className="font-semibold">{household.name}</p>
        </span>
        <HouseholdJoinButton
          householdId={householdId}
          userId={session.user.id}
          title={t("join")}
        />
      </div>
    </div>
  );
}
