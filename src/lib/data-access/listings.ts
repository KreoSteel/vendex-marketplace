"use server";
import prisma from "@/app/shared/api/prisma";
import { Prisma } from "@/utils/generated/client";
import {
   TCreateListing,
   TCreateListingResult,
   TListingRow,
   TUpdateListing,
} from "@/utils/zod-schemas/listings";
import { getUser, withAuth } from "@/app/shared/api/auth/auth";
import { ListingCondition, ListingStatus } from "@/utils/generated/enums";
import { getTranslations } from "next-intl/server";
import { TPaginationListings } from "@/utils/zod-schemas/listings";
import { Result } from "@/types/result";
import * as Sentry from "@sentry/nextjs";

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

export const markListingAsSold = withAuth(async (id: string): Promise<Result<string>> => {
   const tListings = await getTranslations("listings");
   const currentUser = await getUser();

   if (!currentUser) {
      return { success: false, error: "Unauthorized" };
   }

   return await prisma.$transaction(async (tx) => {
      const existingListing = await tx.listing.findUnique({
         where: {
            id: id,
         },
         select: {
            userId: true,
            status: true,
         },
      });

      if (!existingListing) {
         return { success: false, error: tListings("errors.listingNotFound") };
      }

      if (existingListing.status === "SOLD") {
         return {
            success: false,
            error: tListings("errors.listingAlreadySold"),
         };
      }

      if (existingListing.userId !== currentUser.id) {
         return { success: false, error: tListings("errors.notListingOwner") };
      }

      const updatedListing = await tx.listing.update({
         where: {
            id,
         },
         data: {
            status: "SOLD",
            sold: true,
         },
      });

      return { success: true, data: updatedListing.id };
   });
});

export const createListing = withAuth(async (
   listing: TCreateListing
): Promise<Result<TCreateListingResult>> => {
   const user = await getUser();

   if (!user) {
      return { success: false, error: "Unauthorized" };
   }

   const result = await prisma.listing.create({
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
      include: {
         images: true,
      },
   });

   const responseData: TCreateListingResult = {
      description: result.description ?? "No description provided",
      userId: result.userId,
      images: result.images.map(({ url, order }) => ({ url, order })),
      title: result.title,
      price: result.price ?? 0,
      categoryId: result.categoryId,
      location: result.location ?? "",
      condition: result.condition,
   };

   return { success: true, data: responseData };
});

export const deleteListing = withAuth(async (id: string): Promise<Result<string>> => {
   const tListings = await getTranslations("listings");
   const currentUser = await getUser();

   if (!currentUser) {
      return { success: false, error: "Unauthorized" };
   }

   return await prisma.$transaction(async (tx) => {
      const existingListing = await tx.listing.findUnique({
         where: {
            id: id,
         },
         select: {
            userId: true,
         },
      });

      if (!existingListing) {
         return { success: false, error: tListings("errors.listingNotFound") };
      }

      if (existingListing.userId !== currentUser.id) {
         return { success: false, error: tListings("errors.notListingOwner") };
      }

      const result = await tx.listing.delete({
         where: {
            id: id,
         },
      });

      return { success: true, data: result.id };
   });
});

export const updateListing = withAuth(async (
   id: string,
   listing: TUpdateListing
): Promise<Result<string>> => {
   const tListings = await getTranslations("listings");
   const currentUser = await getUser();

   if (!currentUser) {
      return { success: false, error: "Unauthorized" };
   }

   return await prisma.$transaction(async (tx) => {
      const existingListing = await tx.listing.findUnique({
         where: {
            id: id,
         },
         select: {
            userId: true,
         },
      });

      if (!existingListing) {
         return { success: false, error: tListings("errors.listingNotFound") };
      }

      if (existingListing.userId !== currentUser.id) {
         return { success: false, error: tListings("errors.notListingOwner") };
      }

      const { images, ...listingData } = listing;

      const result = await tx.listing.update({
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

      return { success: true, data: result.id };
   });
});
