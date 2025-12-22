import { queryOptions } from "@tanstack/react-query";
import { getUserActiveListings, getUserSoldListings, TListingRow } from "@/app/entities/listings";
import { getReviews, TPublicReview } from "@/app/entities/reviews";
import { Result } from "@/types/result";

export const userActiveListingsOptions = (userId: string) =>
   queryOptions<Awaited<ReturnType<typeof getUserActiveListings>>>({
      queryKey: ["user-active-listings", userId],
      queryFn: async () => {
         return await getUserActiveListings(userId);
      },
      staleTime: 60 * 5 * 1000,
      enabled: !!userId,
   });

export const userSoldListingsOptions = (userId: string) =>
   queryOptions<Result<TListingRow[]>>({
      queryKey: ["user-sold-listings", userId],
      queryFn: async () => {
         return await getUserSoldListings(userId);
      },
      staleTime: 60 * 5 * 1000,
      enabled: !!userId,
   });

export const getUserReviewsOptions = (userId: string) =>
   queryOptions<Result<TPublicReview[]>>({
      queryKey: ["user-reviews", userId],
      queryFn: async () => {
         return await getReviews(userId);
      },
      enabled: !!userId,
   });
