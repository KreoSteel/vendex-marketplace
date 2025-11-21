import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { http } from "@/utils/http";
import {
   AllListingsParams,
   getAllListings,
   getListingById,
   getUserActiveListings,
   getUserFavoriteListings,
   getUserListingsCount,
   getUserSoldListings,
} from "../data-access/listings";

export const recentListingsOptions = queryOptions({
   queryKey: ["recent-listings"],
   queryFn: async () => {
      const response = await http.get("/listings/recent-listings");
      return response.data;
   },
   staleTime: 60 * 5 * 1000,
});

export const allListingsOptions = (params: AllListingsParams) =>
   queryOptions({
      queryKey: ["all-listings", params],
      queryFn: async () => {
         return await getAllListings(params);
      },
      staleTime: 60 * 5 * 1000,
      placeholderData: keepPreviousData,
   });

export const getListingByIdOptions = (id: string) =>
   queryOptions({
      queryKey: ["listing-by-id", id],
      queryFn: async () => {
         return await getListingById(id);
      },
      staleTime: 60 * 5 * 1000,
      enabled: !!id,
   });

export const userListingsCountOptions = (userId: string) =>
   queryOptions({
      queryKey: ["user-listings-count", userId],
      queryFn: async () => {
         return await getUserListingsCount(userId);
      },
      staleTime: 60 * 5 * 1000,
      enabled: !!userId,
   });

export const userActiveListingsOptions = (userId: string) =>
   queryOptions({
      queryKey: ["user-active-listings", userId],
      queryFn: async () => {
         return await getUserActiveListings(userId);
      },
      staleTime: 60 * 5 * 1000,
      enabled: !!userId,
   });

export const userSoldListingsOptions = (userId: string) =>
   queryOptions({
      queryKey: ["user-sold-listings", userId],
      queryFn: async () => {
         return await getUserSoldListings(userId);
      },
      staleTime: 60 * 5 * 1000,
      enabled: !!userId,
   });

export const userFavoriteListingsOptions = (userId: string) =>
   queryOptions({
      queryKey: ["user-favorite-listings", userId],
      queryFn: async () => {
         return await getUserFavoriteListings(userId);
      },
      staleTime: 60 * 5 * 1000,
      enabled: !!userId,
   });
