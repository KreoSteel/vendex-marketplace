import { ProfileCard, ListingTabs, ProfileProvider } from "@/app/widgets/profile";
import { getUser } from "@/app/shared/api/auth/auth";
import { getUserProfile } from "@/app/entities/user";
import { notFound } from "next/navigation";
import { getUserListingsCount } from "@/app/entities/listings";
import { getReviewsStats } from "@/app/entities/reviews";

export const dynamicParams = true;
export const revalidate = 120;

export default async function UserProfilePage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id: userId } = await params;
   const currentUser = await getUser();
   const userProfileResult = await getUserProfile(userId);
   const userProfile = userProfileResult.success
      ? userProfileResult.data
      : null;
   if (!userProfile) {
      notFound();
   }

   const isItOwner = currentUser?.id === userId;
   const [counts, reviewsStatsResult] = await Promise.all([
      getUserListingsCount(userId),
      getReviewsStats(userId),
   ]);

   const reviewsStats = reviewsStatsResult.success
      ? reviewsStatsResult.data
      : { averageRating: 0, totalReviews: 0 };
   return (
      <ProfileProvider userId={userId}>
         <div className="flex flex-col gap-4 max-w-3/4 mx-auto py-12 px-4">
            <ProfileCard
               user={userProfile}
               isOwner={isItOwner}
               stats={{
                  activeListingsCount: counts.activeListings,
                  itemsSoldCount: counts.itemsSold,
                  totalReviewsCount: reviewsStats.totalReviews,
                  averageRating: reviewsStats.averageRating,
               }}
            />
            <ListingTabs
               stats={{
                  reviewsCount: reviewsStats.totalReviews,
                  activeListingsCount: counts.activeListings,
                  soldListingsCount: counts.itemsSold,
                  favoritesListingsCount: counts.favoritesListings,
               }}
               showFavorites={isItOwner}
            />
         </div>
      </ProfileProvider>
   );
}
