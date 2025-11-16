"use client";
import { useQuery } from "@tanstack/react-query";
import { recentListingsOptions } from "@/lib/queries/listings";

export const useGetRecentListings = () => {
    return useQuery(recentListingsOptions);
}