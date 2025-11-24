import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userFavoriteListingsOptions, isListingFavoriteOptions } from "@/lib/queries/favorites";
import { toggleFavoriteAction } from "@/app/actions/favorites";

export const useGetUserFavoriteListings = (userId: string) => {
   return useQuery(userFavoriteListingsOptions(userId));
};

export const useIsListingFavorite = (listingId: string, enabled: boolean = true) => {
    return useQuery({
        ...isListingFavoriteOptions(listingId),
        enabled
    });
}

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (listingId: string) => {
            const result = await toggleFavoriteAction(listingId);
            if (!result.success) {
                throw new Error(result.message);
            }
            return result;
        },
        onSuccess: (data, listingId) => {
            queryClient.invalidateQueries({ queryKey: ["is-listing-favorite", listingId] });
            queryClient.invalidateQueries({ queryKey: ["user-favorite-listings"] });
        },
        onError: (error) => {
            console.error(error.message);
        }
    });
}
