import ProfileCard from "@/components/profile/ProfileCard";
import ListingTabs from "@/components/profile/ListingTabs";
import { getUser } from "@/utils/auth";
import { getUserProfile } from "@/lib/data-access/profile";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { getUserListingsCount } from "@/lib/data-access/listings";
import { getReviewsStats } from "@/lib/data-access/reviews";
import { getLocale } from "next-intl/server";
import { User } from "@/utils/zod-schemas/auth";

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
   const locale = await getLocale();
   if (!userProfile) {
      notFound();
   }

   if (!currentUser) {
      redirect({ href: `/auth/login`, locale: locale });
      return null;
   }

   const isItOwner = currentUser.id === userId;
   const [counts, reviewsStatsResult] = await Promise.all([
      getUserListingsCount(userId),
      getReviewsStats(userId),
   ]);

   const reviewsStats = reviewsStatsResult.success
      ? reviewsStatsResult.data
      : { averageRating: 0, totalReviews: 0 };
   return (
      <div className="flex flex-col gap-4 max-w-3/4 mx-auto py-12 px-4">
         <ProfileCard
            user={userProfile as User}
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
      </div>
   );
}
