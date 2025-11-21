"use client";
import { useQuery } from "@tanstack/react-query";
import {
   recentListingsOptions,
   userActiveListingsOptions,
   userFavoriteListingsOptions,
   userSoldListingsOptions,
   userListingsCountOptions,
   allListingsOptions,
   getListingByIdOptions,
} from "@/lib/queries/listings";
import { AllListingsParams, Filters } from "@/lib/data-access/listings";
import { getMaxPriceForFiltersOptions } from "@/lib/utils";
export const useGetRecentListings = () => {
   return useQuery(recentListingsOptions);
};

export const useGetAllListings = (params: AllListingsParams) => {
   return useQuery(allListingsOptions(params));
};

export const useGetListingById = (id: string) => {
   return useQuery(getListingByIdOptions(id));
};

export const useGetMaxPriceForFilters = (params: Filters) => {
   return useQuery(getMaxPriceForFiltersOptions(params));
};

export const useGetUserActiveListings = (userId: string) => {
   return useQuery(userActiveListingsOptions(userId));
};

export const useGetUserSoldListings = (userId: string) => {
   return useQuery(userSoldListingsOptions(userId));
};

export const useGetUserFavoriteListings = (userId: string) => {
   return useQuery(userFavoriteListingsOptions(userId));
};

export const useGetUserListingsCount = (userId: string) => {
   return useQuery(userListingsCountOptions(userId));
};