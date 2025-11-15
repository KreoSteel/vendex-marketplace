import prisma from "@/utils/prisma";
import {
   createListingSchema,
   TCreateListing,
} from "@/utils/zod-schemas/listings";
import { requireAuth } from "@/utils/auth";

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
            take: 1,
         },
      },
   });
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
         images: true,
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

export async function getAllListings() {
   return await prisma.listing.findMany({
      orderBy: {
         createdAt: "desc",
      },
      select: {
         id: true,
         title: true,
         price: true,
         location: true,
         condition: true,
      },
   });
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
         description: validatedListing.data.description ?? "No description provided",
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
