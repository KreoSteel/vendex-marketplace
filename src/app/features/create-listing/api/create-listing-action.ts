"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { createListing } from "./create-listing";
import { TCreateListingResult, createListingSchema } from "@/app/entities/listings";
import { uploadListingImages } from "@/app/shared/api/storage/upload";
import { ListingCondition } from "@/app/shared/lib/generated/enums";
import * as Sentry from "@sentry/nextjs";

export const createListingAction = withAuth(
   async (
      _prevState: Result<TCreateListingResult> | undefined,
      formData: FormData
   ): Promise<Result<TCreateListingResult>> => {
      const t = await getTranslations("listings.errors");
      const tSystem = await getTranslations("system");
      const currentUser = await getUser();
      const files = formData.getAll("images") as File[];

      if (!currentUser) {
         return { success: false, error: "Unauthorized" };
      }

      const uploadResult = await uploadListingImages(files, currentUser.id);
      if (!uploadResult.success) {
         return { success: false, error: uploadResult.error };
      }
      const urls = uploadResult.data;

      const data = {
         title: formData.get("title") as string,
         description:
            (formData.get("description") as string) ??
            tSystem("noDescriptionProvided"),
         price: (formData.get("price") as string)
            ? parseFloat(formData.get("price") as string)
            : 0,
         categoryId: formData.get("category") as string,
         location: formData.get("location") as string,
         condition: formData.get("condition") as ListingCondition,
         images: urls,
      };

      if (isNaN(data.price) || data.price < 0) {
         return { success: false, error: tSystem("invalidPrice") };
      }

      const validatedData = createListingSchema.safeParse(data);
      if (!validatedData.success) {
         return { success: false, error: validatedData.error.message };
      }

      try {
         const listing = await createListing(validatedData.data);
         if (!listing.success) {
            return { success: false, error: listing.error };
         }
         return { success: true, data: listing.data };
      } catch (error) {
         Sentry.captureException(error);
         return {
            success: false,
            error: t("failedToCreateListing"),
         };
      }
   }
);
