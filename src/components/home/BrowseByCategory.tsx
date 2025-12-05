"use client";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { getIconForCategory } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { TCategory } from "@/utils/zod-schemas/categories";

export default function BrowseByCategory({categories}: {categories: TCategory[]}) {
   const t = useTranslations("home.browseByCategory");
   const searchParams = new URLSearchParams();
   searchParams.set("page", "1");
   searchParams.set("sortBy", "createdAt");
   searchParams.set("sortOrder", "desc");

   return (
      <section className="w-full">
         <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
               {t("title")}
            </h2>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {categories?.map((category) => {
               const Icon = getIconForCategory(category?.icon || "Package");
               return (
                  <Link
                     key={category.id}
                     href={`/listings?${searchParams.toString()}&category=${category.slug}`}
                     className="group">
                     <Card className="py-6 hover:shadow-xl transition-all duration-400 cursor-pointer h-full flex flex-col items-center">
                        <CardHeader className="flex flex-col items-center gap-3 w-full">
                           <div className="flex items-center justify-center bg-primary-100 rounded-full mb-2 h-14 w-14 group-hover:translate-y-[-4px] transition-all duration-400">
                              <Icon className="h-7 w-7 text-neutral-900" />
                           </div>
                           <CardTitle className="text-center text-sm font-medium text-neutral-900">
                              {category.name}
                           </CardTitle>
                        </CardHeader>
                     </Card>
                  </Link>
               );
            })}
         </div>
      </section>
   );
}
