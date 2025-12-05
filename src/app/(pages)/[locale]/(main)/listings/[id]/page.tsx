"use server";
import ListingDetailsClientPage from "@/components/listings/ListingDetailsClientPage";
import {
   getListingById,
   getUserListingsCount,
} from "@/lib/data-access/listings";
import { TListing } from "@/utils/zod-schemas/listings";
import { getReviewsStats } from "@/lib/data-access/reviews";
import { notFound } from "next/navigation";
import { getUser } from "@/utils/auth";

export default async function ListingPageDetails({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;
   const currentUser = await getUser();
   const listing = await getListingById(id);
   if (!listing) {
      notFound();
   }

   const userId = listing.user.id;
   if (!userId) {
      notFound();
   }

   const [listingsCounts, reviewsStats] = await Promise.all([
      getUserListingsCount(userId),
      getReviewsStats(userId),
   ]);

   return (
      <ListingDetailsClientPage
         listing={listing as TListing}
         currentUser={currentUser?.id || ""}
         activeListingsCount={listingsCounts.activeListings}
         itemsSoldCount={listingsCounts.itemsSold}
         averageRating={reviewsStats.averageRating}
      />
   );
}
