"use client";
import { Loader2 } from "lucide-react";
import ReviewCard from "../cards/ReviewCard";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getUserReviewsOptions } from "@/lib/query-options/reviews";

interface UserReviewsTabProps {
   userId: string;
}

export default function UserReviewsTab({ userId }: UserReviewsTabProps) {
   const { data: reviews, isLoading, error } = useQuery(getUserReviewsOptions(userId));
   const tCommon = useTranslations("common");

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
            {tCommon("error")}: {error.message}
         </div>
      );
   } else if (!reviews?.success || reviews.data?.length === 0) {
      return (
         <div className="text-center py-10 text-neutral-500">
            {tCommon("noReviewsFound")}
         </div>
      );
   } else {
      return (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.data.map((review) => (
               <ReviewCard key={review.id} review={review} />
            ))}
         </div>
      );
   }
}
