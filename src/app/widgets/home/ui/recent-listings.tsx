"use client";
import { TListing, TRecentListings } from "@/utils/zod-schemas/listings";
import ListingCard from "@/app/entities/listings/ui/ListingCard";
import { useTranslations } from "next-intl";

interface RecentListingsProps {
   listings: TRecentListings[];
   favoriteIds: Set<string> | string[];
}

export default function RecentListings({
   listings,
   favoriteIds,
}: RecentListingsProps) {
   const t = useTranslations("common");
   const tRecentListings = useTranslations("home.recentListings");
   const favoriteSet = favoriteIds instanceof Set ? favoriteIds : new Set(favoriteIds);

   return (
      <section className="py-16 w-full">
         <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
               {tRecentListings("title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {Array.isArray(listings) && listings.length > 0 ? (
                  listings.map((listing, index: number) => (
                     <ListingCard
                        key={listing.id}
                        listing={listing as TListing}
                        preload={index < 4}
                        isFavorite={favoriteSet.has(listing.id)}
                     />
                  ))
               ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                     {t("noListingsFound")}
                  </div>
               )}
            </div>
         </div>
      </section>
   );
}
