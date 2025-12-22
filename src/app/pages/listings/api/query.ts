"use client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getUserFavoriteListings } from "@/app/entities/favorites";
import { getAllListings, AllListingsParams, TPaginationListings } from "@/app/entities/listings";
import { Result } from "@/types/result";

export const userFavoriteListingsOptions = (userId: string) =>
   queryOptions<Result<Array<{ id: string }>>>({
      queryKey: ["user-favorite-listings", userId],
      queryFn: async () => {
         return await getUserFavoriteListings(userId);
      },
      enabled: !!userId,
      staleTime: 60 * 5 * 1000,
   });

export const allListingsOptions = (params: AllListingsParams) =>
   queryOptions<TPaginationListings>({
      queryKey: ["all-listings", params],
      queryFn: async () => {
         return await getAllListings(params);
      },
      staleTime: 60 * 5 * 1000,
      placeholderData: keepPreviousData,
   });
