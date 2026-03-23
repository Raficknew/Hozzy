"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function LanguageSelect({
  currentLocale,
  className,
}: {
  currentLocale: string;
  className?: string;
}) {
  const languages = ["en", "pl"];

  function changeLanguage(language: string) {
    return;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        defaultValue={currentLocale}
        onValueChange={(value) =>
          value !== currentLocale && changeLanguage(value)
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
