"use client";
import { AllListingsParams, ListingCard, TListingsCard, TPaginationListings } from "@/app/entities/listings";
import SearchBar from "@/app/shared/ui/search";
import ListingsFilters from "./ui/listings-filters";
import PaginationComponent from "@/app/shared/ui/pagination-component";
import { authClient } from "@/app/shared/api/auth/auth-client";
import { userFavoriteListingsOptions } from "./api/query";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { allListingsOptions } from "./api/query";
import { toast } from "sonner";
import { useEffect } from "react";
import ListingPageSkeleton from "./ui/listing-page-skeleton";

export default function ListingsPageClient({
   searchParams,
}: {
   searchParams: AllListingsParams;
}) {
   const tCommon = useTranslations("common");
   const tSearchListingsPage = useTranslations("searchListingsPage");
   const { data: session } = authClient.useSession();
   const { data, isLoading, error } = useQuery<TPaginationListings>(
      allListingsOptions(searchParams)
   );
   const { data: favorites } = useQuery({
      ...userFavoriteListingsOptions(session?.user?.id ?? ""),
      enabled: !!session?.user?.id,
   });

   useEffect(() => {
      if (
         favorites &&
         typeof favorites === "object" &&
         "error" in favorites &&
         typeof favorites.error === "string"
      ) {
         toast.error(favorites.error);
      }
   }, [favorites]);

   const favoriteIds = new Set(
      favorites &&
      typeof favorites === "object" &&
      "success" in favorites &&
      favorites.success &&
      "data" in favorites &&
      Array.isArray(favorites.data)
         ? (favorites.data as Array<{ id: string }>).map(
              (listing) => listing.id
           )
         : []
   );

   return (
      <div className="w-full py-8">
         <div className="flex flex-col lg:flex-row gap-6 px-4 mx-auto">
            <div className="lg:w-64 shrink-0">
               <ListingsFilters />
            </div>

            <main className="flex-1 min-w-0 space-y-10 pb-10">
               <div className="mb-6 flex flex-col gap-3">
                  <SearchBar className="w-full" />
                  <div className="text-sm text-gray-500">
                     {isLoading
                        ? tCommon("loading")
                        : `${tSearchListingsPage("results")} ${
                             data?.totalItems ?? 0
                          }`}
                  </div>
               </div>

               {isLoading ? (
                  <ListingPageSkeleton />
               ) : error ? (
                  <div className="text-center py-12 text-red-500">
                     {tCommon("error")}: {error.message}
                  </div>
               ) : !data || data.listings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                     {tCommon("noListingsFound")}
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {data.listings.map(
                        (listing: TListingsCard, index: number) => (
                           <ListingCard
                              key={listing.id}
                              listing={listing as TListingsCard}
                              preload={index < 4}
                              isFavorite={favoriteIds.has(listing.id)}
                           />
                        )
                     )}
                  </div>
               )}
               <PaginationComponent
                  currentPage={data?.currentPage ?? 1}
                  totalPages={data?.totalPages ?? 1}
               />
            </main>
         </div>
      </div>
   );
}
