"use server";
import prisma from "@/app/shared/api/prisma";
import { Prisma } from "@/app/shared/lib/generated/client";
import {
   TListingRow,
} from "@/app/entities/listings/model/schema";
import { ListingCondition, ListingStatus } from "@/app/shared/lib/generated/enums";
import { TPaginationListings } from "@/app/entities/listings/model/schema";
import { Result } from "@/types/result";
import * as Sentry from "@sentry/nextjs";
import { AllListingsParams } from "../model/types";

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
}: AllListingsParams = {}): Promise<TPaginationListings> {
   const MAX_ITEMS_PER_PAGE = 50;
   const MAX_ARRAY_LENGTH = 50;
   const page =
      typeof currentPage === "string" ? parseInt(currentPage, 10) : currentPage;
   const items =
      Math.min(typeof itemsPerPage === "string"
         ? parseInt(itemsPerPage, 10)
         : itemsPerPage, MAX_ITEMS_PER_PAGE);
   const skip = ((page as number) - 1) * (items as number);

   if (categorySlugs && categorySlugs.length > MAX_ARRAY_LENGTH) {
      throw new Error("Category slugs array is too long");
   }

   if (categorySlugs) {
      categorySlugs.forEach((slug) => {
         if (!/^[a-z0-9-]+$/.test(slug)) {
            Sentry.captureException(new Error("Invalid category slug"));
            throw new Error("Invalid category slug");
         }
      });
   }

   if (conditions && conditions.length > MAX_ARRAY_LENGTH) {
      throw new Error("Conditions array is too long");
   }

   if (conditions) {
      conditions.forEach((condition) => {
         if (!Object.values(ListingCondition).includes(condition)) {
            Sentry.captureException(new Error("Invalid condition"));
            throw new Error("Invalid condition");
         }
      });
   }

   const sanitizedSearch = search ? search.trim().slice(0, 100) : null;

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
      ...(sanitizedSearch && {
         OR: [
            {
               title: {
                  contains: sanitizedSearch,
                  mode: "insensitive" as const,
               },
            },
            {
               description: {
                  contains: sanitizedSearch,
                  mode: "insensitive" as const,
               },
            },
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
      listings: listings as TListingRow[],
      currentPage: page as number,
      itemsPerPage: items as number,
      totalPages: Math.ceil(totalCount / (items as number)),
      totalItems: totalCount,
   };
}

export async function getMaxPrice(params: Filters) {
   const DEFAULT_MAX_PRICE = 100;
   const sanitizedSearch = params.search ? params.search.trim().slice(0, 100) : null;
   const where: Prisma.ListingWhereInput = {
      status: ListingStatus.ACTIVE,
      ...(params.categorySlugs &&
         params.categorySlugs.length > 0 && {
            category: { slug: { in: params.categorySlugs } },
         }),
      ...(sanitizedSearch && {
         OR: [
            {
               title: { contains: sanitizedSearch, mode: "insensitive" as const },
            },
            {
               description: {
                  contains: sanitizedSearch,
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

   return result._max.price ?? DEFAULT_MAX_PRICE;
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
   const listing = await prisma.listing.findUnique({
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
   if (!listing) {
      return {
         success: false,
         error: "Listing not found",
      };
   }

   return {
      success: true,
      data: listing,
   };
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

export async function getUserSoldListings(
   userId: string
): Promise<Result<TListingRow[]>> {
   const result = await prisma.listing.findMany({
      where: {
         userId,
         status: "SOLD",
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

   return { success: true, data: result as TListingRow[] };
}





