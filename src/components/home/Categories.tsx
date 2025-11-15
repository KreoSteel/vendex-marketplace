import { Card, CardHeader, CardTitle } from "../ui/card";
import { getAllCategories } from "@/lib/data-access/category";
import { getIconForCategory } from "@/lib/utils";
import Link from "next/link";

export default async function BrowseByCategory() {
   const categories = await getAllCategories();

   return (
      <section className="py-16 w-full">
         <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-8">
               Browse by Category
            </h2>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {categories.map((category) => {
               const Icon = getIconForCategory(category.icon);
               return (
                  <Link
                     key={category.id}
                     href={`/categories/${category.slug}`}
                     className="group">
                     <Card className="py-6 hover:shadow-md transition-all duration-400 cursor-pointer h-full flex flex-col items-center">
                        <CardHeader className="flex flex-col items-center gap-3 w-full">
                           <div className="flex items-center justify-center bg-primary-50 rounded-full mb-2 h-14 w-14 group-hover:bg-primary-100 transition-colors">
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
