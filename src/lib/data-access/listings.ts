"use server";
import prisma from "@/utils/prisma";
import { Prisma } from "@/utils/generated/client";
import {
   createListingSchema,
   TCreateListing,
   TListing,
} from "@/utils/zod-schemas/listings";
import { requireAuth } from "@/utils/auth";
import { ListingCondition, ListingStatus } from "@/utils/generated/enums";

type AllListingsParams = {
   currentPage?: number;
   itemsPerPage?: number;
   categoryId?: string | null;
   condition?: ListingCondition | null;
   search?: string | null;
   sortBy?: "createdAt" | "price";
   sortOrder?: "asc" | "desc";
};

export async function getAllListings({
   currentPage = 1,
   itemsPerPage = 20,
   categoryId,
   search,
   condition,
   sortBy = "createdAt",
   sortOrder = "desc",
}: AllListingsParams = {}) {
   const skip = (currentPage - 1) * itemsPerPage;

   const where: Prisma.ListingWhereInput = {
      status: ListingStatus.ACTIVE,
      ...(categoryId && { categoryId }),
      ...(search && {
         title: { contains: search, mode: "insensitive" as const },
         description: { contains: search, mode: "insensitive" as const },
      }),
      ...(condition && { condition }),
   };
   
   return await prisma.listing.findMany({
      where,
      orderBy: {
         [sortBy]: sortOrder,
      },
      skip,
      take: itemsPerPage,
      select: {
         id: true,
         title: true,
         price: true,
         location: true,
         condition: true,
         createdAt: true,
         updatedAt: true,
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
   });
}

export async function getRecentListings() {
   return await prisma.listing.findMany({
      orderBy: {
         createdAt: "desc",
      },
      take: 6,
      select: {
         id: true,
         title: true,
         price: true,
         location: true,
         condition: true,
         createdAt: true,
         updatedAt: true,
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
   });
}

export async function getUserListingsCount(userId: string) {
   await requireAuth();

   const [activeListings, itemsSold, TotalReviews, favoritesListings] =
      await Promise.all([
         // Active listings count
         prisma.listing.count({
            where: {
               userId,
               status: "ACTIVE",
            },
         }),

         // Items sold count
         prisma.listing.count({
            where: {
               userId,
               sold: true,
            },
         }),

         // Total reviews count
         prisma.review.count({
            where: {
               revieweeId: userId,
            },
         }),

         // Favorites listings count
         prisma.favorite.count({
            where: {
               userId,
            },
         }),
      ]);

   return {
      activeListings,
      itemsSold,
      TotalReviews,
      favoritesListings,
   };
}

export async function getListingById(id: string) {
   await requireAuth();

   return await prisma.listing.findUnique({
      where: {
         id: id,
      },
      select: {
         id: true,
         title: true,
         price: true,
         location: true,
         condition: true,
         description: true,
         status: true,
         views: true,
         sold: true,
         featured: true,
         createdAt: true,
         updatedAt: true,
         images: {
            orderBy: {
               order: "asc",
            },
         },
         category: {
            select: {
               id: true,
               name: true,
               icon: true,
            },
         },
         user: {
            select: {
               id: true,
               name: true,
               avatarImg: true,
               location: true,
            },
         },
      },
   });
}

export async function getUserActiveListings(userId: string) {
   await requireAuth();

   return await prisma.listing.findMany({
      where: {
         userId,
         status: "ACTIVE",
      },
      orderBy: {
         createdAt: "desc",
      },
      select: {
         id: true,
         title: true,
         price: true,
         location: true,
         condition: true,
         createdAt: true,
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
   });
}

export async function getUserSoldListings(userId: string): Promise<TListing[]> {
   await requireAuth();

   const result = await prisma.listing.findMany({
      where: {
         userId,
         OR: [
            {
               status: "SOLD",
               sold: true,
            },
         ],
      },
      orderBy: {
         createdAt: "desc",
      },
      select: {
         id: true,
         title: true,
         price: true,
         location: true,
         condition: true,
         createdAt: true,
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
   });

   return result as unknown as TListing[];
}

export async function getUserFavoriteListings(userId: string) {
   await requireAuth();

   const favorites = await prisma.favorite.findMany({
      where: {
         userId,
      },
      orderBy: {
         createdAt: "asc",
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

export async function createListing(listing: TCreateListing) {
   const user = await requireAuth();

   const validatedListing = createListingSchema.safeParse(listing);
   if (!validatedListing.success) {
      return { error: validatedListing.error.message };
   }

   return await prisma.listing.create({
      data: {
         ...validatedListing.data,
         description:
            validatedListing.data.description ?? "No description provided",
         userId: user.id,
         images: {
            create: validatedListing.data.images.map((image, index) => ({
               url: image,
               order: index,
            })),
         },
      },
   });
}
