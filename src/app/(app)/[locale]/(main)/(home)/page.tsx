import { Hero, BrowseByCategory, RecentListings } from "@/app/widgets/home";
import { getAllCategories, TCategory } from "@/app/entities/category";
import { getRecentListings, TRecentListings } from "@/app/entities/listings";

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
