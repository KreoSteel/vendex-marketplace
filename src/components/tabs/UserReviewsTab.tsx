"use client";
import ReviewCard from "../cards/ReviewCard";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getUserReviewsOptions } from "@/lib/query-options/reviews";
import ReviewCardSkeleton from "../skeletons/ReviewCardSkeleton";

interface UserReviewsTabProps {
   userId: string;
}

export default function UserReviewsTab({ userId }: UserReviewsTabProps) {
   const {
      data: reviews,
      isLoading,
      error,
   } = useQuery(getUserReviewsOptions(userId));
   const tCommon = useTranslations("common");

   if (isLoading) {
      return (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
               <ReviewCardSkeleton key={index} />
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-center py-12 text-red-500">
            {tCommon("error")}: {error.message}
         </div>
      );
   }

   if (!reviews?.success || reviews.data?.length === 0) {
      return (
         <div className="text-center py-12 text-gray-500">
            {tCommon("noReviewsFound")}
         </div>
      );
   }

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {reviews.data.map((review) => (
            <ReviewCard key={review.id} review={review} />
         ))}
      </div>
   );
}
