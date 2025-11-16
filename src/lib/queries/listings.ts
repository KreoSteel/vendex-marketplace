import { queryOptions } from "@tanstack/react-query";
import { http } from "@/utils/http";

export const recentListingsOptions = queryOptions({
    queryKey: ["recent-listings"],
    queryFn: async () => {
        const response = await http.get("/recent-listings");
        return response.data;
    },
    staleTime: 60 * 5 * 1000,
})