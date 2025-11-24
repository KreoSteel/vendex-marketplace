"use server";
import { requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";

export async function toggleFavorite(listingId: string) {
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
      return { success: true, message: "Removed from favorites", action: "removed" };
   } else {
      await prisma.favorite.create({
         data: {
            userId,
            listingId,
         },
      });
      return { success: true, message: "Added to favorites", action: "added" };
   }
}


export async function getUserFavoriteListings(userId: string) {
    // Allow access if asking for own favorites, or maybe public?
    // Usually favorites are private.
    const user = await requireAuth();
    if (user.id !== userId) {
        // Simple check: only allow own favorites for now
        // Or if we want to allow viewing others' favorites, we'd check privacy settings.
        // For MVP, let's assume private or strict check.
        // But wait, the function argument is userId.
        // If I am logged in as A, can I see B's favorites?
        // The plan says "Get user's favorites (auth required)". Implicitly OWN favorites.
        // So I should probably ignore the userId arg and use the session userId, 
        // OR enforce that userId matches session.
        if (user.id !== userId) {
             throw new Error("Unauthorized access to favorites");
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
    const user = await requireAuth();
    const userId = user.id;
    
    const count = await prisma.favorite.count({
        where: {
            userId,
            listingId
        }
    });
    
    return count > 0;
 }
