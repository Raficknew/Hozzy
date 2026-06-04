"use client";
import {
  ArrowRight01Icon,
  DashboardCircleIcon,
  Home01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function SettingsNavigationBar({
  householdId,
  canAccessHouseholdSettings,
}: {
  householdId: string;
  canAccessHouseholdSettings: boolean;
}) {
  const pathnameSegments = usePathname().split("/").filter(Boolean);
  const currentRoute = pathnameSegments[2] ?? "";
  const t = useTranslations("Settings");
  const navigationButtons = [
    {
      link: `/${householdId}/settings/categories`,
      title: t("categories.title"),
      icon: DashboardCircleIcon,
      testId: "settings-categories-link",
    },
  ];

  return (
    <div className="flex sm:gap-4 gap-2 flex-col sm:flex-row ">
      <div className="sm:flex hidden">
        <NavigationBar
          title={t("account.title")}
          link={`/${householdId}/settings/account`}
          icon={UserIcon}
          currentPath={currentRoute ?? ""}
          testId="settings-account-link"
        />
      </div>
      {canAccessHouseholdSettings && (
        <NavigationBar
          title={t("household.title")}
          link={`/${householdId}/settings/household`}
          icon={Home01Icon}
          currentPath={currentRoute ?? ""}
          testId="settings-household-link"
        />
      )}
      {navigationButtons.map((navigation) => (
        <NavigationBar
          key={navigation.title}
          title={navigation.title}
          link={navigation.link}
          icon={navigation.icon}
          currentPath={currentRoute ?? ""}
          testId={navigation.testId}
        />
      ))}
    </div>
  );
}

function NavigationBar({
  link,
  title,
  icon,
  currentPath,
  testId,
}: {
  link: string;
  title: string;
  icon: typeof UserIcon;
  currentPath: string;
  testId: string;
}) {
  const isActive =
    currentPath === link.split("/")[3] ||
    (currentPath === "" && title === "Dashboard");
  return (
    <Link
      href={link}
      data-testid={testId}
      className={cn(
        "flex items-center p-2 rounded-full justify-between",
        isActive && "bg-primary",
      )}
    >
      <div className="flex gap-2">
        <HugeiconsIcon strokeWidth={3} width={20} height={20} icon={icon} />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <HugeiconsIcon className="sm:hidden" icon={ArrowRight01Icon} />
    </Link>
  );
}
