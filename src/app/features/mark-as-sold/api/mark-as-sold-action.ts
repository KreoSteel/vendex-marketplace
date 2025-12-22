"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { markListingAsSold } from "./mark-as-sold-dal";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";

export const markListingAsSoldAction = withAuth(async (
    listingId: string
 ): Promise<Result<{ id: string; message: string }>> => {
    const t = await getTranslations("listings.errors");
    try {
       const markedListing = await markListingAsSold(listingId);
       if (!markedListing.success) {
          return { success: false, error: markedListing.error };
       }
 
       revalidatePath("/profile");
       revalidatePath(`/listings/${listingId}`);
       return {
          success: true,
          data: {
             id: markedListing.data,
             message: t("listingMarkedAsSoldSuccessfully"),
          },
       };
    } catch (error) {
       Sentry.captureException(error);
       return {
          success: false,
          error: t("failedToMarkAsSold"),
       };
    }
 });
 