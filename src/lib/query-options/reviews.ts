import { getReviewsStats, getReviews } from "../data-access/reviews";
import { queryOptions } from "@tanstack/react-query";

export const getUserReviewsOptions = (userId: string) =>
   queryOptions({
      queryKey: ["user-reviews", userId],
      queryFn: async () => {
         return await getReviews(userId);
      },
      enabled: !!userId,
   });

   
export const getUserReviewsStatsOptions = (userId: string) =>
   queryOptions({
      queryKey: ["user-reviews-stats", userId],
      queryFn: async () => {
         return await getReviewsStats(userId);
      },
      enabled: !!userId,
   });
