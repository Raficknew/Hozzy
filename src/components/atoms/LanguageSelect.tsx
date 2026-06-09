"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { switchLanguage } from "@/global/actions";
import { cn } from "@/lib/utils";

export function LanguageSelect({
  currentLocale,
  className,
}: {
  currentLocale: string;
  className?: string;
}) {
  const languages = ["en", "pl"];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        value={currentLocale}
        onValueChange={(value) => {
          if (value && value !== currentLocale) {
            switchLanguage(value);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={currentLocale}>
            {currentLocale.toUpperCase()}
          </SelectValue>
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
