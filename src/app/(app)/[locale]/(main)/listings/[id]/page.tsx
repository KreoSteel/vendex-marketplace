import { ListingDetailsClientPage } from "@/app/pages/listing-details";
import {
   getListingById,
   getUserListingsCount,
   TListing,
} from "@/app/entities/listings";
import { getReviewsStats } from "@/app/entities/reviews";
import { notFound } from "next/navigation";
import { getUser } from "@/app/shared/api/auth/auth";

export const dynamicParams = true;
export const revalidate = 120;

export default async function ListingPageDetails({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;
   const currentUser = await getUser();
   const listingResult = await getListingById(id);
   const listing = listingResult.success ? listingResult.data : null;
   if (!listing) {
      notFound();
   }

   const userId = listing.user.id;
   if (!userId) {
      notFound();
   }

   const [listingsCounts, reviewsStatsResult] = await Promise.all([
      getUserListingsCount(userId),
      getReviewsStats(userId),
   ]);

   const reviewsStats = reviewsStatsResult.success
      ? reviewsStatsResult.data
      : { averageRating: 0, totalReviews: 0 };
      
   return (
      <ListingDetailsClientPage
         listing={listing as TListing}
         currentUser={currentUser?.id || ""}
         stats={{
            activeListingsCount: listingsCounts.activeListings,
            itemsSoldCount: listingsCounts.itemsSold,
            averageRating: reviewsStats.averageRating,
         }}
      />
   );
}
