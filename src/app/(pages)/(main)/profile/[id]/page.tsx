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
import { getUserListingsCount } from "@/lib/data-access/listings";
import { getUserProfile } from "@/lib/data-access/profile";
import { notFound } from "next/navigation";

type UserListingsCounts = Awaited<ReturnType<typeof getUserListingsCount>>;

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
   await Promise.all([
      queryClient.prefetchQuery(userActiveListingsOptions(userId)),
      queryClient.prefetchQuery(userSoldListingsOptions(userId)),
      queryClient.prefetchQuery(userListingsCountOptions(userId)),
      ...(isItOwner
         ? [queryClient.prefetchQuery(userFavoriteListingsOptions(userId))]
         : []),
   ]);

   const counts: UserListingsCounts | undefined = queryClient.getQueryData(
      userListingsCountOptions(userId).queryKey
   );

   return (
      <div className="flex flex-col gap-4 max-w-3/4 mx-auto">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfileCard
               user={userProfile}
               activeListingsCount={counts?.activeListings ?? 0}
               itemsSoldCount={counts?.itemsSold ?? 0}
               totalReviewsCount={counts?.TotalReviews ?? 0}
               isOwner={isItOwner}
            />
            <ListingTabs
               userId={userId}
               activeListingsCount={counts?.activeListings ?? 0}
               soldListingsCount={counts?.itemsSold ?? 0}
               favoritesListingsCount={counts?.favoritesListings ?? 0}
               showFavorites={isItOwner}
            />
         </HydrationBoundary>
      </div>
   );
}
