"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavoriteAction } from "@/app/features/toggle-favorite/api/toggle-favorite-action";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import type { Result } from "@/types/result";

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (listingId: string) => {
            const result = (await toggleFavoriteAction(listingId)) as Result<string>;
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
            Sentry.captureException(error);
            toast.error(error instanceof Error ? error.message : "Unknown error");
        }
    });
}
