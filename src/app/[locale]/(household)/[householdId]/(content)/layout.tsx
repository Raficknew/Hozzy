import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";
import { UserAvatar } from "@/components/atoms/UserAvatar";
import { DatePicker } from "@/components/molecules/DatePicker";
import { Sidebar } from "@/components/organisms/Sidebar";
import { getHousehold } from "@/global/actions";
import { auth } from "@/lib/auth";

export default async function HouseholdLayout({
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
    <div>
      <TopBar householdId={householdId} />
      <Sidebar />
      <div className="sm:pl-22 px-3 h-full pb-2 ">{children}</div>
    </div>
  );
}

async function TopBar({ householdId }: { householdId: string }) {
  const session = await auth();

  if (session == null) redirect("/sign-in");

  return (
    <div className="flex w-full sm:justify-between gap-2 sm:gap-0 px-5 py-3">
      <div className="sm:hidden mr-auto">
        <HozzyLogo size={44} link />
      </div>
      <div className="h-px w-px sm:block hidden"></div>

      <DatePicker />
      <div>
        <Link href={`/${householdId}/settings/account`} className="relative">
          <div className="absolute right-0 bottom-0 z-10 bg-green-400 w-2.5 h-2.5 rounded-full p-1"></div>
          <UserAvatar image={session.user.image} className="size-10" />
        </Link>
      </div>
    </div>
  );
}
