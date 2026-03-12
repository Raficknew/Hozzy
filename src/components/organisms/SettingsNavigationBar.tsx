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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SettingsNavigationBar({
  householdId,
  canAccessHouseholdSettings,
}: {
  householdId: string;
  canAccessHouseholdSettings: boolean;
}) {
  const currentPath = usePathname().split("/")[4];
  const t = useTranslations("Settings");
  const navigationButtons = [
    {
      link: `/${householdId}/settings/categories`,
      title: t("categories.title"),
      icon: DashboardCircleIcon,
    },
  ];

  return (
    <div className="flex gap-2 flex-col sm:flex-row ">
      <div className="sm:flex hidden">
        <NavigationBar
          title={t("account.title")}
          link={`/${householdId}/settings/account`}
          icon={UserIcon}
          currentPath={currentPath ?? ""}
        />
      </div>
      {canAccessHouseholdSettings && (
        <div>
          <NavigationBar
            title={t("household.title")}
            link={`/${householdId}/settings/household`}
            icon={Home01Icon}
            currentPath={currentPath ?? ""}
          />
        </div>
      )}
      {navigationButtons.map((navigation) => (
        <NavigationBar
          key={navigation.title}
          title={navigation.title}
          link={navigation.link}
          icon={navigation.icon}
          currentPath={currentPath ?? ""}
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
}: {
  link: string;
  title: string;
  icon: typeof UserIcon;
  currentPath: string;
}) {
  const isActive =
    currentPath === link.split("/")[3] ||
    (currentPath === "" && title === "Dashboard");
  return (
    <Button
      variant={isActive ? "navigation" : "ghost"}
      className={cn(
        "sm:rounded-full rounded-sm flex justify-between md:justify-center",
        isActive && "bg-none",
      )}
      asChild
    >
      <Link href={link}>
        <div className="flex items-center gap-2">
          <HugeiconsIcon strokeWidth={3} width={20} height={20} icon={icon} />
          <p className="text-sm font-medium">{title}</p>
        </div>
        <HugeiconsIcon className="sm:hidden" icon={ArrowRight01Icon} />
      </Link>
    </Button>
  );
}
