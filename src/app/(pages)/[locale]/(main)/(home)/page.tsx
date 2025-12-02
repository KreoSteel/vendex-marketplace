import Hero from "@/components/home/Hero";
import BrowseByCategory from "@/components/home/BrowseByCategory";
import RecentListings from "@/components/home/RecentListings";
import { recentListingsOptions } from "@/lib/query-options/listings";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { categoriesOptions } from "@/hooks/useCategories";

export default async function Home() {
   const queryClient = getQueryClient();

   await Promise.all([
      queryClient.prefetchQuery(recentListingsOptions),
      queryClient.prefetchQuery(categoriesOptions),
   ]);

   return (
      <div className="flex flex-col space-y-32 py-16">
         <Hero />
         <HydrationBoundary state={dehydrate(queryClient)}>
            <BrowseByCategory />
            <RecentListings />
         </HydrationBoundary>
      </div>
   );
}
