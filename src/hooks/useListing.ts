"use client";
import { useQuery } from "@tanstack/react-query";
import {
   recentListingsOptions,
   userActiveListingsOptions,
   userFavoriteListingsOptions,
   userSoldListingsOptions,
   userListingsCountOptions,
} from "@/lib/queries/listings";

export const useGetRecentListings = () => {
   return useQuery(recentListingsOptions);
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