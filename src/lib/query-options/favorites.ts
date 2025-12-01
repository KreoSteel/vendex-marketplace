import { getUserFavoriteListings, isListingFavorite } from "../data-access/favorites";
import { queryOptions } from "@tanstack/react-query";

export const userFavoriteListingsOptions = (userId: string) =>
    queryOptions({
       queryKey: ["user-favorite-listings", userId],
       queryFn: async () => {
          return await getUserFavoriteListings(userId);
       },
       enabled: !!userId,
       staleTime: 60 * 5 * 1000,
    });

export const isListingFavoriteOptions = (listingId: string, userId?: string) => 
    queryOptions({
        queryKey: ["is-listing-favorite", listingId, userId],
        queryFn: async () => {
            return await isListingFavorite(listingId);
        },
        enabled: !!listingId,
        retry: false,
        staleTime: 60 * 5 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

