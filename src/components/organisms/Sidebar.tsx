"use client";
import {
  ArrowDataTransferHorizontalIcon,
  DashboardSquare03Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";
import { SignOutButton } from "@/components/atoms/SignOutButton";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { householdId } = useParams();
  const locale = useLocale();
  const t = useTranslations("Sidebar");
  const currentRoute = usePathname().split("/")[3];

  const searchParams = useSearchParams();
  const qs = searchParams?.toString();
  const withParams = (path: string) => (qs ? `${path}?${qs}` : path);

  const routes = [
    {
      title: t("dashboard"),
      url: withParams(`/${locale}/${householdId}`),
      icon: DashboardSquare03Icon,
    },
    {
      title: t("transactions"),
      url: withParams(`/${locale}/${householdId}/transactions`),
      icon: ArrowDataTransferHorizontalIcon,
    },
  ];
  return (
    <div className="fixed z-50 sm:h-auto sm:left-2 sm:rounded-xl rounded-t-2xl sm:bottom-2 bottom-0 sm:top-2 bg-sidebar w-full sm:w-auto h-fit p-4 flex flex-row sm:flex-col justify-evenly sm:justify-between">
      <div className="flex flex-col gap-10 items-center">
        <div className="hidden sm:block">
          <HozzyLogo variant="white" link />
        </div>
        <div className="flex sm:flex-col gap-5">
          {routes.map((route) => (
            <div
              className="flex justify-center gap-5 sm:gap-0"
              key={route.title}
            >
              <Route
                title={route.title}
                currentRoute={currentRoute ?? ""}
                url={route.url}
                icon={route.icon}
              />
              {routes.indexOf(route) < 1 && (
                <div className="w-px sm:w-0 bg-[#616062]"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="self-center hidden sm:flex sm:flex-col gap-5">
        <Route
          currentRoute={currentRoute ?? ""}
          url={`/${locale}/${householdId}/settings/account`}
          icon={Settings01Icon}
        />
        <SignOutButton />
      </div>
    </div>
  );
}

function Route({
  icon,
  url,
  currentRoute,
  title,
}: {
  icon: typeof Settings01Icon;
  url: string;
  currentRoute: string;
  title?: string;
}) {
  const isHovered =
    currentRoute === url.split("/")[3] ||
    currentRoute === url.split("/")[3]?.split("?")[0] ||
    (currentRoute === "" && title === "Dashboard");

  return (
    <Link
      href={url}
      className={cn(
        "self-center p-1 sm:p-2",
        isHovered && "sm:bg-accent rounded-full sm:shadow-xl",
      )}
    >
      <div className="sm:hidden flex">
        <HugeiconsIcon
          strokeWidth={2}
          width={22}
          color={cn(isHovered && "#7047EB")}
          height={22}
          icon={icon}
        />
      </div>
      <div className="hidden sm:flex">
        <HugeiconsIcon strokeWidth={2} width={20} height={20} icon={icon} />
      </div>
    </Link>
  );
}
