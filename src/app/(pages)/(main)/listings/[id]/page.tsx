import ListingDetailsClientPage from "@/components/listings/ListingDetailsClientPage";
import { getListingByIdOptions } from "@/lib/queries/listings";
import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ListingPageDetails({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = await params;
   const queryClient = getQueryClient();
   await queryClient.prefetchQuery(getListingByIdOptions(id));

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <ListingDetailsClientPage id={id}/>
      </HydrationBoundary>
   );
}
