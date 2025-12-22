"use server";
import { getUser, withAuth } from "@/app/shared/api/auth/auth";
import prisma from "@/app/shared/api/prisma";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { TListingRow } from "@/app/entities/listings";

export const getUserFavoriteListings = withAuth(
   async (userId: string): Promise<Result<TListingRow[]>> => {
      const tFavorites = await getTranslations("favorites");
      const user = await getUser();
      if (!user || user.id !== userId) {
         return {
            success: false,
            error: tFavorites("errors.unauthorizedAccess"),
         };
      }

      const result = await prisma.favorite.findMany({
         where: {
            userId,
         },
         orderBy: {
            createdAt: "desc",
         },
         select: {
            listing: {
               select: {
                  id: true,
                  title: true,
                  price: true,
                  location: true,
                  condition: true,
                  createdAt: true,
                  updatedAt: true,
                  status: true,
                  images: {
                     select: {
                        url: true,
                     },
                     take: 1,
                     orderBy: {
                        order: "asc",
                     },
                  },
               },
            },
         },
      });

      return {
         success: true,
         data: result.map((fav) => fav.listing as TListingRow),
      };
   }
);
