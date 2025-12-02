"use server";
import { requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { getTranslations } from "next-intl/server";

export async function toggleFavorite(listingId: string) {
   const tFavorites = await getTranslations("favorites");
   const user = await requireAuth();
   const userId = user.id;

   const existingFavorite = await prisma.favorite.findUnique({
      where: {
         userId_listingId: {
            userId,
            listingId,
         },
      },
   });

   if (existingFavorite) {
      await prisma.favorite.delete({
         where: {
            userId_listingId: {
               userId,
               listingId,
            },
         },
      });
      return { success: true, message: tFavorites("success.removedFromFavorites"), action: "removed" };
   } else {
      await prisma.favorite.create({
         data: {
            userId,
            listingId,
         },
      });
      return { success: true, message: tFavorites("success.addedToFavorites"), action: "added" };
   }
}


export async function getUserFavoriteListings(userId: string) {
    const tFavorites = await getTranslations("favorites");
    const user = await requireAuth();
    if (user.id !== userId) {
        if (user.id !== userId) {
             throw new Error(tFavorites("errors.unauthorizedAccess"));
        }
    }
 
    const favorites = await prisma.favorite.findMany({
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
 
    return favorites.map((fav) => fav.listing);
 }

 export async function isListingFavorite(listingId: string) {
    const user = await requireAuth({ redirect: false }).catch(() => null);
    if (!user) return false;
    
    const count = await prisma.favorite.count({
        where: {
            userId: user.id,
            listingId
        }
    });
    
    return count > 0;
 }
