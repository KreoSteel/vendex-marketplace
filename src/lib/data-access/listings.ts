"use server";
import prisma from "@/utils/prisma";
import { Prisma } from "@/utils/generated/client";
import {
   TCreateListing,
   TListing,
   TUpdateListing,
} from "@/utils/zod-schemas/listings";
import { requireAuth } from "@/utils/auth";
import { ListingCondition, ListingStatus } from "@/utils/generated/enums";
import { getTranslations } from "next-intl/server";

export type AllListingsParams = {
   currentPage?: string | number;
   itemsPerPage?: string | number;
   categorySlugs?: string[] | null;
   condition?: ListingCondition | null;
   conditions?: ListingCondition[] | null;
   minPrice?: number | null;
   maxPrice?: number | null;
   search?: string | null;
   sortBy?: "createdAt" | "price";
   sortOrder?: "asc" | "desc";
};

export type Filters = {
   search?: string | null;
   categorySlugs?: string[] | null;
   conditions?: ListingCondition[] | null;
};

export async function getAllListings({
   currentPage = 1,
   itemsPerPage = 20,
   categorySlugs,
   search,
   condition,
   conditions,
   minPrice,
   maxPrice,
   sortBy = "createdAt",
   sortOrder = "desc",
}: AllListingsParams = {}) {
   const page =
      typeof currentPage === "string" ? parseInt(currentPage, 10) : currentPage;
   const items =
      typeof itemsPerPage === "string" ? parseInt(itemsPerPage, 10) : itemsPerPage;
   const skip = ((page as number) - 1) * (items as number);

   const where: Prisma.ListingWhereInput = {
      status: ListingStatus.ACTIVE,
      ...(categorySlugs &&
         categorySlugs.length > 0 && {
            category: { slug: { in: categorySlugs } },
         }),
      ...(conditions &&
         conditions.length > 0 && { condition: { in: conditions } }),
      ...(minPrice !== null &&
         minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== null &&
         maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(search && {
         OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
         ],
      }),
      ...(condition && { condition }),
   };

   const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
         where,
         orderBy: {
            [sortBy]: sortOrder,
         },
         skip,
         take: items as number,
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
      }),
      prisma.listing.count({ where }),
   ]);

   return {
      listings,
      totalCount,
      currentPage: page as number,
      itemsPerPage: items as number,
      totalPages: Math.ceil(totalCount / (items as number)),
   };
}

export async function getMaxPrice(params: Filters) {
   const where: Prisma.ListingWhereInput = {
      status: ListingStatus.ACTIVE,
      ...(params.categorySlugs &&
         params.categorySlugs.length > 0 && {
            category: { slug: { in: params.categorySlugs } },
         }),
      ...(params.search && {
         OR: [
            {
               title: { contains: params.search, mode: "insensitive" as const },
            },
            {
               description: {
                  contains: params.search,
                  mode: "insensitive" as const,
               },
            },
         ],
      }),
      ...(params.conditions &&
         params.conditions.length > 0 && {
            condition: { in: params.conditions },
         }),
   };

   const result = await prisma.listing.aggregate({
      where,
      _max: {
         price: true,
      },
   });

   return result._max?.price ?? 1000;
}

export async function getRecentListings() {
   return await prisma.listing.findMany({
      orderBy: {
         createdAt: "desc",
      },
      take: 20,
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
   const [activeListings, itemsSold, favoritesListings] = await Promise.all([
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
      favoritesListings,
   };
}

export async function getListingById(id: string) {
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
               createdAt: true,
            },
         },
      },
   });
}

export async function getUserActiveListings(userId: string) {
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

export async function markListingAsSold(id: string) {
   const tListings = await getTranslations("listings");
   const currentUser = await requireAuth();
   
   const existingListing = await prisma.listing.findUnique({
      where: {
         id: id,
      },
      select: {
         userId: true,
         status: true,
      },
   });

   if (!existingListing) {
      return { error: tListings("errors.listingNotFound") };
   }

   if (existingListing.status === "SOLD") {
      return { error: tListings("errors.listingAlreadySold") };
   }

   if (existingListing.userId !== currentUser.id) {
      return { error: tListings("errors.notListingOwner") };
   }

   return await prisma.listing.update({
      where: {
         id,
      },
      data: {
         status: "SOLD",
         sold: true,
      }
   });

}

export async function createListing(listing: TCreateListing) {
   const user = await requireAuth();

   return await prisma.listing.create({
      data: {
         ...listing,
         description: listing.description ?? "No description provided",
         userId: user.id,
         images: {
            create: listing.images.map((image, index) => ({
               url: image,
               order: index,
            })),
         },
      },
   });
}

export async function deleteListing(id: string) {
   const tListings = await getTranslations("listings");
   const currentUser = await requireAuth();

   const existingListing = await prisma.listing.findUnique({
      where: {
         id: id,
      },
      select: {
         userId: true,
      },
   });

   if (!existingListing) {
      return { error: tListings("errors.listingNotFound") };
   }

   if (existingListing.userId !== currentUser.id) {
      return { error: tListings("errors.notListingOwner") };
   }

   return await prisma.listing.delete({
      where: {
         id: id,
      },
   });
}

export async function updateListing(id: string, listing: TUpdateListing) {
   const tListings = await getTranslations("listings");
   const currentUser = await requireAuth();

   const existingListing = await prisma.listing.findUnique({
      where: {
         id: id,
      },
      select: {
         userId: true,
      },
   });

   if (!existingListing) {
      return { error: tListings("errors.listingNotFound") };
   }

   if (existingListing.userId !== currentUser.id) {
      return { error: tListings("errors.notListingOwner") };
   }

   const { images, ...listingData } = listing;

   return await prisma.listing.update({
      where: {
         id: id,
      },
      data: {
         ...listingData,
         ...(images &&
            images.length > 0 && {
               images: {
                  deleteMany: {},
                  create: images.map((image, index) => ({
                     url: image,
                     order: index,
                  })),
               },
            }),
      },
      include: {
         images: true,
      },
   });
}
