"use server";
import prisma from "@/app/shared/api/prisma";
import { getUser } from "@/app/shared/api/auth/auth";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";

export const toggleFavorite = withAuth(
   async (listingId: string): Promise<Result<string>> => {
      const tFavorites = await getTranslations("favorites");
      const user = await getUser();
      if (!user) {
         return {
            success: false,
            error: tFavorites("errors.unauthorizedAccess"),
         };
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
   }
);

export async function isListingFavorite(listingId: string) {
   const user = await getUser();
   if (!user) return false;

   const count = await prisma.favorite.count({
      where: {
         userId: user.id,
         listingId,
      },
   });

   return count > 0;
}
