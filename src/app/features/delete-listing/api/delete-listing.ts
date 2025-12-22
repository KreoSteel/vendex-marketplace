"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import prisma from "@/app/shared/api/prisma";

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
 