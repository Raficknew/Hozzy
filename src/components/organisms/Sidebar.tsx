"use client";
import {
  ArrowDataTransferHorizontalIcon,
  DashboardSquare03Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";
import { SignOutButton } from "@/components/atoms/SignOutButton";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

export function Sidebar() {
  const { householdId } = useParams();
  const t = useTranslations("Sidebar");
  const pathnameSegments = usePathname().split("/").filter(Boolean);
  const currentRoute = pathnameSegments[1] ?? "";

  const searchParams = useSearchParams();
  const qs = searchParams?.toString();
  const withParams = (path: string) => (qs ? `${path}?${qs}` : path);

  const routes = [
    {
      title: t("dashboard"),
      url: withParams(`/${householdId}`),
      routeKey: "",
      icon: DashboardSquare03Icon,
      dataTestId: "sidebar-dashboard",
    },
    {
      title: t("transactions"),
      url: withParams(`/${householdId}/transactions`),
      routeKey: "transactions",
      icon: ArrowDataTransferHorizontalIcon,
      dataTestId: "sidebar-transactions",
    },
  ];
  return (
    <Card className="fixed z-50 sm:h-auto sm:left-2 sm:rounded-xl rounded-t-2xl sm:bottom-2 bottom-0 sm:top-2 w-full sm:w-auto h-fit p-0">
      <CardContent className="p-4 flex flex-row sm:flex-col justify-evenly sm:justify-between h-full">
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
                  currentRoute={currentRoute ?? ""}
                  url={route.url}
                  routeKey={route.routeKey}
                  icon={route.icon}
                  dataTestId={route.dataTestId}
                />
                {routes.indexOf(route) < 1 && (
                  <div className="w-px sm:w-0 bg-sidebar-ring"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="self-center hidden sm:flex sm:flex-col gap-5">
          <Route
            currentRoute={currentRoute ?? ""}
            url={`/${householdId}/settings/account`}
            routeKey="settings"
            icon={Settings01Icon}
            dataTestId="sidebar-settings"
          />
          <SignOutButton />
        </div>
      </CardContent>
    </Card>
  );
}

function Route({
  icon,
  url,
  currentRoute,
  routeKey,
  dataTestId,
}: {
  icon: typeof Settings01Icon;
  url: string;
  currentRoute: string;
  routeKey: string;
  dataTestId: string;
}) {
  const isHovered = currentRoute === routeKey;

  return (
    <Link
      href={url}
      data-testid={dataTestId}
      className={cn(
        "self-center p-1 sm:p-2",
        isHovered && "sm:bg-primary rounded-full sm:shadow-xl",
      )}
    >
      <div className="sm:hidden flex">
        <HugeiconsIcon
          strokeWidth={2}
          width={22}
          color={cn(isHovered && "#8200db")}
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
