"use client";
import ListingCard from "@/components/cards/ListingCard";
import { userSoldListingsOptions } from "@/lib/query-options/listings";
import { useQuery } from "@tanstack/react-query";
import { TListing } from "@/utils/zod-schemas/listings";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";


interface SoldItemsTabProps {
    userId: string;
}

export default function SoldItemsTab({ userId }: SoldItemsTabProps) {
    const { data: listings, isLoading, error } = useQuery(userSoldListingsOptions(userId));
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
            (listings && listings.length > 0) ? (
                listings.map((listing: TListing, index: number) => (
                    <ListingCard 
                        key={listing.id} 
                        listing={listing} 
                        preload={index < 4}
                    />
                ))
            ) : (
                <div>{tCommon("noSoldItems")}</div>
            )
        )}
     </div>
    )
}