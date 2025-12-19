"use client";
import ListingCard from "@/app/entities/listings/ui/ListingCard";
import { userActiveListingsOptions } from "@/lib/query-options/listings";
import { TListingsCard } from "@/utils/zod-schemas/listings";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import ListingPageSkeleton from "@/app/pages/listings/ui/listing-page-skeleton";

interface ActiveListingsTabProps {
   userId: string;
}

export default function ActiveListingsTab({ userId }: ActiveListingsTabProps) {
   const {
      data: listings,
      isLoading,
      error,
   } = useQuery(userActiveListingsOptions(userId));
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
   if (!listings || listings.length === 0) {
      return (
         <div className="text-center py-12 text-gray-500">
            {tCommon("noActiveListings")}
         </div>
      );
   }
   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {listings?.map((listing, index: number) => (
            <ListingCard
               key={listing.id}
               listing={listing as TListingsCard}
               preload={index < 4}
            />
         ))}
      </div>
   );
}
