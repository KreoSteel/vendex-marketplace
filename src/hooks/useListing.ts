import { useQuery, queryOptions } from "@tanstack/react-query";
import { getRecentListings } from "@/lib/data-access/listings";

export const recentListingsOptions = queryOptions({
    queryKey: ["recent-listings"],
    queryFn: () => getRecentListings(),
    staleTime: 60 * 5,
})

export const useGetRecentListings = () => {
    return useQuery(recentListingsOptions);
}