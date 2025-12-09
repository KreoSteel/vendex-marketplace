"use server";
import { requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { TListing } from "@/utils/zod-schemas/listings";

export async function toggleFavorite(
   listingId: string
): Promise<Result<string>> {
   const tFavorites = await getTranslations("favorites");
   const user = await requireAuth();
   if (!user.success) {
      return { success: false, error: tFavorites("errors.unauthorizedAccess") };
   }
   const userId = user.data!.id;

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

export async function getUserFavoriteListings(
   userId: string
): Promise<Result<TListing[]>> {
   const tFavorites = await getTranslations("favorites");
   const user = await requireAuth();
   if (!user.success || user.data!.id !== userId) {
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

   return { success: true, data: result.map((fav) => fav.listing as TListing) };
}

export async function isListingFavorite(listingId: string) {
   const user = await requireAuth({ redirect: false }).catch(() => null);
   if (!user?.success) return false;

   const count = await prisma.favorite.count({
      where: {
         userId: user.data!.id,
         listingId,
      },
   });

   return count > 0;
}
