"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { deleteListing } from "./delete-listing";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";

export const deleteListingAction = withAuth(
   async (listingId: string): Promise<Result<string>> => {
      const t = await getTranslations("listings.errors");
      try {
         const deletedListing = await deleteListing(listingId);

         if ("error" in deletedListing) {
            return { success: false, error: deletedListing.error as string };
         }

         revalidatePath("/profile");
         revalidatePath("/listings");
         revalidatePath(`/listings/${listingId}`);

         return { success: true, data: t("listingDeletedSuccessfully") };
      } catch (error) {
         Sentry.captureException(error);
         return {
            success: false,
            error: t("failedToDeleteListing"),
         };
      }
   }
);
