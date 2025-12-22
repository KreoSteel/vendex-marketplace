"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import prisma from "@/app/shared/api/prisma";

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