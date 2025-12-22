import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/app/shared/api/auth/auth-client";
import { isListingFavoriteOptions } from "../api/queries";

export const useIsListingFavorite = (listingId: string, enabled: boolean = true) => {
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;

    return useQuery({
        ...isListingFavoriteOptions(listingId, userId),
        enabled: enabled && !!userId
    });
}