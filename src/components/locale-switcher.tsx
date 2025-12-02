"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (nextLocale: string) => {
    router.push(pathname, { locale: nextLocale });
  };

  return (
    <Select defaultValue={locale} onValueChange={switchLocale}>
      <SelectTrigger>
        <SelectValue placeholder="Select a locale" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="ru">RU</SelectItem>
        <SelectItem value="uk">UK</SelectItem>
        <SelectItem value="it">IT</SelectItem>
      </SelectContent>
    </Select>
  );
};