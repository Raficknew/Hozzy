"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Settings.account.theme");
  const items = [
    { label: t("options.light"), value: "light" },
    { label: t("options.dark"), value: "dark" },
    { label: t("options.system"), value: "system" },
  ];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Select
      items={items}
      value={theme}
      onValueChange={(value) => setTheme(value ?? "system")}
    >
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder={t("placeholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
