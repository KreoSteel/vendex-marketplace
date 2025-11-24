import ProfileCard from "@/components/profile/ProfileCard";
import ListingTabs from "@/components/profile/ListingTabs";
import { requireAuth } from "@/utils/auth";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
   userActiveListingsOptions,
   userSoldListingsOptions,
   userListingsCountOptions,
} from "@/lib/queries/listings";
import { userFavoriteListingsOptions } from "@/lib/queries/favorites";
import { getUserListingsCount } from "@/lib/data-access/listings";

type UserListingsCounts = Awaited<ReturnType<typeof getUserListingsCount>>;

export default async function ProfilePage() {
   const user = await requireAuth();

   const queryClient = getQueryClient();

   await Promise.all([
      queryClient.prefetchQuery(userActiveListingsOptions(user.id)),
      queryClient.prefetchQuery(userSoldListingsOptions(user.id)),
      queryClient.prefetchQuery(userFavoriteListingsOptions(user.id)),
      queryClient.prefetchQuery(userListingsCountOptions(user.id)),
   ]);

   const counts: UserListingsCounts | undefined = queryClient.getQueryData(
      userListingsCountOptions(user.id).queryKey
   );
   

   return (
      <div className="flex flex-col gap-4 max-w-3/4 mx-auto">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfileCard
               user={user}
               activeListingsCount={counts?.activeListings ?? 0}
               itemsSoldCount={counts?.itemsSold ?? 0}
               totalReviewsCount={counts?.TotalReviews ?? 0}
               isOwner={true}
            />
            <ListingTabs
               userId={user.id}
               activeListingsCount={counts?.activeListings ?? 0}
               soldListingsCount={counts?.itemsSold ?? 0}
               favoritesListingsCount={counts?.favoritesListings ?? 0}
               showFavorites={true}
            />
         </HydrationBoundary>
      </div>
   );
}
