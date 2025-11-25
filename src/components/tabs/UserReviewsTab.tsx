"use client";
import { useGetUserReviews } from "@/hooks/useReviews";
import { Loader2 } from "lucide-react";
import ReviewCard from "../cards/ReviewCard";

interface UserReviewsTabProps {
    userId: string;
}

export default function UserReviewsTab({ userId }: UserReviewsTabProps) {
    const { data: reviews, isLoading, error } = useGetUserReviews(userId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                Error loading reviews: {error.message}
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-10 text-neutral-500">
                No reviews found
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
}
