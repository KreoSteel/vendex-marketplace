import ListingDetailsClientPage from "@/components/listings/ListingDetailsClientPage";
import { getListingByIdOptions, userListingsCountOptions } from "@/lib/queries/listings";
import { getUserReviewsStatsOptions } from "@/lib/queries/reviews";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getUser } from "@/utils/auth";

export default async function ListingPageDetails({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;
   const queryClient = getQueryClient();
   const currentUser = await getUser();
   
   const listing = await queryClient.fetchQuery(getListingByIdOptions(id));
   
   const [listingsCountData, reviewsStats] = await Promise.all([
      queryClient.fetchQuery(userListingsCountOptions(listing?.user?.id || "")),
      queryClient.fetchQuery(getUserReviewsStatsOptions(listing?.user?.id || "")),
   ]);

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <ListingDetailsClientPage id={id} currentUser={currentUser?.id || ""} activeListingsCount={listingsCountData.activeListings} averageRating={reviewsStats.averageRating}/>
      </HydrationBoundary>
   );
}
