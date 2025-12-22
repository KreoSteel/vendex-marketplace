import { ProfileCard, ListingTabs, ProfileProvider } from "@/app/widgets/profile";
import { getUser } from "@/app/shared/api/auth/auth";
import { getUserProfile } from "@/app/entities/user";
import { redirect } from "@/pkg/i18n/navigation";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getUserListingsCount } from "@/app/entities/listings";
import { getReviewsStats } from "@/app/entities/reviews";

export const revalidate = 120;

export default async function ProfilePage() {
   const currentUser = await getUser();
   const profileUserResult = await getUserProfile();
   const profileUser = profileUserResult.success
      ? profileUserResult.data
      : null;
   const locale = await getLocale();
   if (!profileUser) {
      notFound();
   }
   if (!currentUser) {
      redirect({ href: `/auth/login`, locale: locale });
   }

   const [counts, reviewsStatsResult] = await Promise.all([
      getUserListingsCount(profileUser.id),
      getReviewsStats(profileUser.id),
   ]);

   const reviewsStats = reviewsStatsResult.success
      ? reviewsStatsResult.data
      : { averageRating: 0, totalReviews: 0 };
   return (
      <ProfileProvider userId={profileUser.id}>
      <div className="container max-w-6xl mx-auto py-6 flex flex-col gap-6">
         <ProfileCard
            user={profileUser}
            stats={{
               activeListingsCount: counts.activeListings,
               itemsSoldCount: counts.itemsSold,
               totalReviewsCount: reviewsStats.totalReviews,
               averageRating: reviewsStats.averageRating,
            }}
            isOwner={true}
         />
         <ListingTabs
            stats={{
               activeListingsCount: counts.activeListings,
               soldListingsCount: counts.itemsSold,
               favoritesListingsCount: counts.favoritesListings,
               reviewsCount: reviewsStats.totalReviews,
            }}
            showFavorites={true}
         />
      </div>
      </ProfileProvider>
   );
}
