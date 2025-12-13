"use server";
import { getUser, withAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { TListingRow } from "@/utils/zod-schemas/listings";

export const toggleFavorite = withAuth(async (
   listingId: string
): Promise<Result<string>> => {
   const tFavorites = await getTranslations("favorites");
   const user = await getUser();
   if (!user) {
      return { success: false, error: tFavorites("errors.unauthorizedAccess") };
   }
   const userId = user.id;

   const result = await prisma.$transaction(async (tx) => {
      const existingFavorite = await tx.favorite.findUnique({
         where: {
            userId_listingId: {
               userId,
               listingId,
            },
         },
      });

      if (existingFavorite) {
         await tx.favorite.delete({
            where: {
               userId_listingId: {
                  userId,
                  listingId,
               },
            },
         });
         return {
            success: true,
            message: tFavorites("success.removedFromFavorites"),
            action: "removed",
         };
      } else {
         await tx.favorite.create({
            data: {
               userId,
               listingId,
            },
         });
         return {
            success: true,
            message: tFavorites("success.addedToFavorites"),
            action: "added",
         };
      }
   });
   return { success: true, data: result.message };
});

export const getUserFavoriteListings = withAuth(async (
   userId: string
): Promise<Result<TListingRow[]>> => {
   const tFavorites = await getTranslations("favorites");
   const user = await getUser();
   if (!user || user.id !== userId) {
      return { success: false, error: tFavorites("errors.unauthorizedAccess") };
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

   return { success: true, data: result.map((fav) => fav.listing as TListingRow) };
});

export async function isListingFavorite(listingId: string) {
   const user = await getUser()
   if (!user) return false;

   const count = await prisma.favorite.count({
      where: {
         userId: user.id,
         listingId,
      },
   });

   return count > 0;
}
