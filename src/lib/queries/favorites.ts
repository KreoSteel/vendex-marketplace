import { getUserFavoriteListings, isListingFavorite } from "../data-access/favorites";
import { queryOptions } from "@tanstack/react-query";

export const userFavoriteListingsOptions = (userId: string) =>
    queryOptions({
       queryKey: ["user-favorite-listings", userId],
       queryFn: async () => {
          return await getUserFavoriteListings(userId);
       },
       enabled: !!userId,
    });

export const isListingFavoriteOptions = (listingId: string) => 
    queryOptions({
        queryKey: ["is-listing-favorite", listingId],
        queryFn: async () => {
            return await isListingFavorite(listingId);
        },
        enabled: !!listingId,
        retry: false,
    });
