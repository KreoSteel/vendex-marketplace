import Hero from "@/app/widgets/home/hero";
import BrowseByCategory from "@/app/widgets/home/browse-by-category";
import RecentListings from "@/app/widgets/home/recent-listings";
import { getAllCategories } from "@/app/entities/category/data-access/category";
import { TCategory } from "@/utils/zod-schemas/categories";
import { getRecentListings } from "@/lib/data-access/listings";
import { TRecentListings } from "@/utils/zod-schemas/listings";

export const revalidate = 60;

export default async function Home() {
   const categories = (await getAllCategories()) as TCategory[];
   const listings = (await getRecentListings()) as TRecentListings[];
   
   return (
      <div className="flex flex-col space-y-32 py-16">
         <Hero />
         <BrowseByCategory categories={categories} />
         <RecentListings listings={listings} favoriteIds={new Set()} />
      </div>
   );
}
