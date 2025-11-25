import ProfileCard from "@/components/profile/ProfileCard";
import ListingTabs from "@/components/profile/ListingTabs";
import { getUser, requireAuth } from "@/utils/auth";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
   userActiveListingsOptions,
   userSoldListingsOptions,
   userListingsCountOptions,
} from "@/lib/queries/listings";
import { userFavoriteListingsOptions } from "@/lib/queries/favorites";
import { getUserProfile } from "@/lib/data-access/profile";
import { getUserReviewsStatsOptions, getUserReviewsOptions } from "@/lib/queries/reviews";
import { notFound } from "next/navigation";


export default async function UserProfilePage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id: userId } = await params;
   const currentUser = await getUser();

   const userProfile = await getUserProfile(userId);
   if (!userProfile) {
      notFound();
   }

   const isItOwner = currentUser?.id === userId;

   const queryClient = getQueryClient();
   const [counts, reviewsStats] = await Promise.all([
      queryClient.fetchQuery(userListingsCountOptions(userId)),
      queryClient.fetchQuery(getUserReviewsStatsOptions(userId)),
      queryClient.prefetchQuery(userActiveListingsOptions(userId)),
      queryClient.prefetchQuery(userSoldListingsOptions(userId)),
      queryClient.prefetchQuery(getUserReviewsOptions(userId)),
      ...(isItOwner
         ? [queryClient.prefetchQuery(userFavoriteListingsOptions(userId))]
         : []),
   ]);

   return (
      <div className="flex flex-col gap-4 max-w-3/4 mx-auto">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfileCard
               user={userProfile}
               activeListingsCount={counts.activeListings}
               itemsSoldCount={counts.itemsSold}
               totalReviewsCount={reviewsStats.totalReviews}
               isOwner={isItOwner}
               averageRating={reviewsStats.averageRating}
            />
            <ListingTabs
               userId={userId}
               activeListingsCount={counts.activeListings}
               soldListingsCount={counts.itemsSold}
               favoritesListingsCount={counts.favoritesListings}
               reviewsCount={reviewsStats.totalReviews}
               showFavorites={isItOwner}
            />
         </HydrationBoundary>
      </div>
   );
}
