import Hero from "@/components/home/Hero";
import BrowseByCategory from "@/components/home/BrowseByCategory";
import RecentListings from "@/components/home/RecentListings";
import { getAllCategories } from "@/lib/data-access/category";
import { TCategory } from "@/utils/zod-schemas/categories";
import { getRecentListings } from "@/lib/data-access/listings";
import { TRecentListings } from "@/utils/zod-schemas/listings";

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
