"use client";
import { useGetRecentListings } from "@/hooks/useListing";
import { TListing } from "@/utils/zod-schemas/listings";
import ListingCard from "../cards/ListingCard";
import { useQuery } from "@tanstack/react-query";
import { userFavoriteListingsOptions } from "@/lib/query-options/favorites";
import { authClient } from "@/utils/auth-client";

export default function RecentListings() {
   const { data: listings, isLoading, error } = useGetRecentListings();
   const { data: session } = authClient.useSession();

   const { data: favorites } = useQuery({
      ...userFavoriteListingsOptions(session?.user?.id ?? ""),
      enabled: !!session?.user?.id,
   });
   
   const favoriteIds = new Set(favorites?.map(f => f.id) ?? []);

   if (isLoading) {
      return (
         <section className="py-16 w-full">
            <div className="container mx-auto px-4">
               <h2 className="text-2xl font-bold mb-8">Recent Listings</h2>
               <p>Loading...</p>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="py-16 w-full">
            <div className="container mx-auto px-4">
               <h2 className="text-2xl font-bold mb-8">Recent Listings</h2>
               <p>Error loading listings</p>
            </div>
         </section>
      );
   }

   return (
      <section className="py-16 w-full">
         <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Recent Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {listings.map((listing: TListing, index: number) => (
                  <ListingCard 
                     key={listing.id} 
                     listing={listing} 
                     preload={index < 4}
                     isFavorite={favoriteIds.has(listing.id)}
                  />
               ))}
            </div>
         </div>
      </section>
   );
}
