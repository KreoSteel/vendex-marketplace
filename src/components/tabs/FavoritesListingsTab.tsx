"use client";
import ListingCard from "@/app/entities/listings/ui/ListingCard";
import { userFavoriteListingsOptions } from "@/lib/query-options/favorites";
import { useQuery } from "@tanstack/react-query";
import { TListingsCard } from "@/utils/zod-schemas/listings";
import { useTranslations } from "next-intl";
import ListingPageSkeleton from "../skeletons/ListingPageSkeleton";

interface FavoritesListingsTabProps {
   userId: string;
}

export default function FavoritesListingsTab({ userId }: FavoritesListingsTabProps) {
   const {
      data: listings,
      isLoading,
      error,
   } = useQuery(userFavoriteListingsOptions(userId));
   const tCommon = useTranslations("common");
   
   if (isLoading) {
      return <ListingPageSkeleton />;
   }
   if (error) {
      return (
         <div className="text-center py-12 text-red-500">
            {tCommon("error")}: {error.message}
         </div>
      );
   }
   if (!listings?.success || listings.data?.length === 0) {
      return (
         <div className="text-center py-12 text-gray-500">
            {tCommon("noFavorites")}
         </div>
      );
   }
   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {listings.data.map((listing, index: number) => (
            <ListingCard
               key={listing.id}
               listing={listing as TListingsCard}
               preload={index < 4}
            />
         ))}
      </div>
   );
}