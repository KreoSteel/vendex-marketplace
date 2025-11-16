"use client";
import { useGetRecentListings } from "@/hooks/useListing";
import { TListing } from "@/utils/zod-schemas/listings";
import ListingCard from "../listings/ListingCard";

export default function RecentListings() {
   const { data: listings, isLoading, error } = useGetRecentListings();

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
               {listings.map((listing: TListing) => (
                  <ListingCard key={listing.id} listing={listing} />
               ))}
            </div>
         </div>
      </section>
   );
}
