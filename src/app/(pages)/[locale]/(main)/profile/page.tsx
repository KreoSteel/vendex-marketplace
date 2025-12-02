import ProfileCard from "@/components/profile/ProfileCard";
import ListingTabs from "@/components/profile/ListingTabs";
import { requireAuth } from "@/utils/auth";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
   userActiveListingsOptions,
   userSoldListingsOptions,
   userListingsCountOptions,
} from "@/lib/query-options/listings";
import { 
    getUserReviewsStatsOptions, 
    getUserReviewsOptions 
} from "@/lib/query-options/reviews";
import { userFavoriteListingsOptions } from "@/lib/query-options/favorites";

export default async function ProfilePage() {
   const user = await requireAuth();
   const queryClient = getQueryClient();

   const [counts, reviewsStats] = await Promise.all([
      queryClient.fetchQuery(userListingsCountOptions(user.id)),
      queryClient.fetchQuery(getUserReviewsStatsOptions(user.id)),
      queryClient.prefetchQuery(userActiveListingsOptions(user.id)),
      queryClient.prefetchQuery(userSoldListingsOptions(user.id)),
      queryClient.prefetchQuery(userFavoriteListingsOptions(user.id)),
      queryClient.prefetchQuery(getUserReviewsOptions(user.id)),
   ]);

   return (
      <div className="container max-w-6xl mx-auto py-6 flex flex-col gap-6">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfileCard
               user={user}
               activeListingsCount={counts.activeListings}
               itemsSoldCount={counts.itemsSold}
               totalReviewsCount={reviewsStats.totalReviews}
               isOwner={true}
               averageRating={reviewsStats.averageRating}
            />
            <ListingTabs
               userId={user.id}
               activeListingsCount={counts.activeListings}
               soldListingsCount={counts.itemsSold}
               favoritesListingsCount={counts.favoritesListings}
               reviewsCount={reviewsStats.totalReviews}
               showFavorites={true}
            />
         </HydrationBoundary>
      </div>
   );
}
