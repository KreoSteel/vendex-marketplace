import ListingDetailsClientPage from "@/components/listings/ListingDetailsClientPage";
import {
   getListingByIdOptions,
   userListingsCountOptions,
} from "@/lib/query-options/listings";
import { getUserReviewsStatsOptions } from "@/lib/query-options/reviews";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { requireAuth } from "@/utils/auth";

export default async function ListingPageDetails({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;
   const queryClient = getQueryClient();
   const currentUser = await requireAuth({ redirect: false }).catch(() => null);

   const listing = await queryClient.fetchQuery(getListingByIdOptions(id));

   const [listingsCountData, reviewsStats] = await Promise.all([
      queryClient.fetchQuery(userListingsCountOptions(listing?.user?.id || "")),
      queryClient.fetchQuery(
         getUserReviewsStatsOptions(listing?.user?.id || "")
      ),
   ]);

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <ListingDetailsClientPage
            id={id}
            currentUser={currentUser?.id || ""}
            activeListingsCount={listingsCountData.activeListings}
            itemsSoldCount={listingsCountData.itemsSold}
            averageRating={reviewsStats.averageRating}
         />
      </HydrationBoundary>
   );
}
