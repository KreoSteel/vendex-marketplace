"use client";
import ListingCard from "@/components/cards/ListingCard";
import { useGetUserActiveListings } from "@/hooks/useListing";
import { TListing } from "@/utils/zod-schemas/listings";
import { Loader2 } from "lucide-react";

interface ActiveListingsTabProps {
   userId: string;
}

export default function ActiveListingsTab({ userId }: ActiveListingsTabProps) {
   const { data: listings, isLoading, error } = useGetUserActiveListings(userId);

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {isLoading ? (
            <div className="flex items-center justify-center gap-2">
               Loading... <Loader2 className="w-4 h-4 animate-spin" />
            </div>
         ) : error ? (
            <div>Error: {error.message}</div>
         ) : (
            (listings && listings.length > 0) ? (
                listings.map((listing: TListing, index: number) => (
                    <ListingCard 
                        key={listing.id} 
                        listing={listing} 
                        preload={index < 4}
                    />
                ))
            ) : (
                <div>No active listings found</div>
            )
         )}
      </div>
   );
}
