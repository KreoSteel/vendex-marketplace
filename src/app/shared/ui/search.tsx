"use client";
import { Input } from "./input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/app/shared/utils/utils";
import { useRouter } from "@/pkg/i18n/navigation";
import { useTranslations } from "next-intl";

export default function SearchBar({ className }: { className?: string }) {
   const router = useRouter();
   const t = useTranslations("home.hero");
   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const search = formData.get("search") as string;
      const params = new URLSearchParams();
      if (search) {
         params.set("search", search);
      } else {
         params.delete("search");
      }

      params.set("page", "1");
      params.set("sortBy", "createdAt");
      params.set("sortOrder", "desc");

      router.push(`/listings?${params.toString()}`);
   };
   return (
      <form onSubmit={handleSearch} className="relative w-full">
         <Input
            type="text"
            name="search"
            placeholder={t("searchPlaceholder")}
            className={cn(
               "w-full pl-8 shadow-sm rounded-lg border border-neutral-200 h-10 font-medium bg-white",
               className
            )}
         />
         <SearchIcon className="size-4 absolute inset-y-0 left-2 my-auto text-neutral-600" />
      </form>
   );
}
