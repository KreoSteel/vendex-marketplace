import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isListingFavoriteOptions } from "@/lib/query-options/favorites";
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
                return { success: false, error: result.error };
            }
            return { success: true, data: result };
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
