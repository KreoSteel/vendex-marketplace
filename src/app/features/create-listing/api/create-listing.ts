"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { Result } from "@/types/result";
import { TCreateListing, TCreateListingResult } from "@/app/entities/listings";
import prisma from "@/app/shared/api/prisma";

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