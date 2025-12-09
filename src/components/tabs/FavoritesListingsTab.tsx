"use client";
import ListingCard from "@/components/cards/ListingCard";
import { userFavoriteListingsOptions } from "@/lib/query-options/favorites";
import { useQuery } from "@tanstack/react-query";
import { TListing } from "@/utils/zod-schemas/listings";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";


interface FavoritesListingsTabProps {
    userId: string;
}

export default function FavoritesListingsTab({ userId }: FavoritesListingsTabProps) {
    const { data: listings, isLoading, error } = useQuery(userFavoriteListingsOptions(userId));
    const tCommon = useTranslations("common");
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
           <div className="flex items-center justify-center gap-2">
              {tCommon("loading")} <Loader2 className="w-4 h-4 animate-spin" />
           </div>
        ) : error ? (
           <div>{tCommon("error")}: {error.message}</div>
        ) : (
            (listings?.success && listings.data?.length > 0) ? (
                listings.data.map((listing, index: number) => (
                    <ListingCard 
                        key={listing.id} 
                        listing={listing as TListing} 
                        preload={index < 4}
                    />
                ))
            ) : (
                <div>{tCommon("noFavorites")}</div>
            )
        )}
     </div>
    )
}