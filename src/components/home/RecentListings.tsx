"use client";
import { useGetRecentListings } from "@/hooks/useListing";
import { TListing } from "@/utils/zod-schemas/listings";
import ListingCard from "../cards/ListingCard";
import { useQuery } from "@tanstack/react-query";
import { userFavoriteListingsOptions } from "@/lib/query-options/favorites";
import { authClient } from "@/utils/auth-client";
import { useTranslations } from "next-intl";

export default function RecentListings() {
   const t = useTranslations("common");
   const tRecentListings = useTranslations("home.recentListings");
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
               <h2 className="text-2xl font-bold mb-8">{tRecentListings("title")}</h2>
               <p>{t("loading")}</p>
            </div>
         </section>
      );
   }

   if (error) {
      return (
         <section className="py-16 w-full">
            <div className="container mx-auto px-4">
               <h2 className="text-2xl font-bold mb-8">{tRecentListings("title")}</h2>
               <p>{t("error")}</p>
            </div>
         </section>
      );
   }

   return (
      <section className="py-16 w-full">
         <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">{tRecentListings("title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {Array.isArray(listings) && listings.length > 0 ? (
                  listings.map((listing: TListing, index: number) => (
                     <ListingCard 
                        key={listing.id} 
                        listing={listing} 
                        preload={index < 4}
                        isFavorite={favoriteIds.has(listing.id)}
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
