import Hero from "@/components/home/Hero";
import BrowseByCategory from "@/components/home/BrowseByCategory";
import RecentListings from "@/components/home/RecentListings";
import { recentListingsOptions } from "@/lib/queries/listings";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Home() {
   const queryClient = getQueryClient();
   await queryClient.prefetchQuery(recentListingsOptions);

   return (
      <div className="flex flex-col space-y-32 py-16">
         <Hero />
         <BrowseByCategory />
         <HydrationBoundary state={dehydrate(queryClient)}>
            <RecentListings />
         </HydrationBoundary>
      </div>
   );
}
