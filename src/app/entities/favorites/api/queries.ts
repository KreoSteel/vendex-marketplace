import { queryOptions } from "@tanstack/react-query";
import { isListingFavorite } from "@/app/features/toggle-favorite";

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
