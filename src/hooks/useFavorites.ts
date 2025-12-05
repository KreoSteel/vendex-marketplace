import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userFavoriteListingsOptions, isListingFavoriteOptions } from "@/lib/query-options/favorites";
import { toggleFavoriteAction } from "@/app/actions/favorites";
import { authClient } from "@/utils/auth-client";

export const useIsListingFavorite = (listingId: string, enabled: boolean = true) => {
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;

    return useQuery({
        ...isListingFavoriteOptions(listingId, userId),
        enabled: enabled && !!userId
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
