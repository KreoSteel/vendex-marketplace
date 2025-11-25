import { useQuery } from "@tanstack/react-query";
import { getUserReviewsOptions, getUserReviewsStatsOptions } from "@/lib/queries/reviews";

export const useGetUserReviews = (userId: string) => {
    return useQuery(getUserReviewsOptions(userId));
};

export const useGetUserReviewsStats = (userId: string) => {
    return useQuery(getUserReviewsStatsOptions(userId));
};