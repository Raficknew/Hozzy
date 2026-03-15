"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSelect({
  currentLocale,
  className,
}: {
  currentLocale: string;
  className?: string;
}) {
  const languages = routing.locales;
  const pathname = usePathname();

  function changeLanguage(language: string, pathname: string) {
    if (pathname !== "/") {
      redirect({ locale: language, href: pathname });
    } else {
      redirect({ locale: language, href: pathname });
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        defaultValue={currentLocale}
        onValueChange={(value) =>
          value !== currentLocale && changeLanguage(value, pathname)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={currentLocale} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
