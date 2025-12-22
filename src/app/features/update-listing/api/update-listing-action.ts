"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { updateListing } from "./update-listing";
import { uploadListingImages } from "@/app/shared/api/storage/upload";
import { ListingCondition } from "@/app/shared/lib/generated/enums";
import { updateListingSchema } from "@/app/entities/listings";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

export const updateListingAction = withAuth(
   async (
      _prevState: Result<string> | undefined,
      formData: FormData
   ): Promise<Result<string>> => {
      const t = await getTranslations("listings.errors");
      const tSystem = await getTranslations("system");
      const currentUser = await getUser();
      const files = formData.getAll("images") as File[];
      const existingImages: string[] = formData
         .getAll("existingImages")
         .filter(
            (item): item is string =>
               typeof item === "string" && item.trim() !== ""
         ) as string[];

      if (!currentUser) {
         return { success: false, error: "Unauthorized" };
      }

      const uploadResult = await uploadListingImages(files, currentUser.id);

      if (!uploadResult.success) {
         return { success: false, error: uploadResult.error };
      }

      const urls = uploadResult.data;

      const listingId = formData.get("id") as string;
      if (!listingId) {
         return { success: false, error: t("listingIdRequired") };
      }

      const data = {
         title: formData.get("title") as string,
         description:
            (formData.get("description") as string) ??
            tSystem("noDescriptionProvided"),
         price: formData.get("price")
            ? parseFloat(formData.get("price") as string)
            : 0,
         location: formData.get("location") as string,
         condition: formData.get("condition") as ListingCondition,
         images: [...existingImages, ...urls],
      };

      const validatedData = updateListingSchema.safeParse(data);

      if (!validatedData.success) {
         return { success: false, error: validatedData.error.message };
      }

      try {
         const editedListing = await updateListing(
            listingId,
            validatedData.data
         );
         if ("error" in editedListing) {
            return { success: false, error: editedListing.error as string };
         }

         revalidatePath(`/listings/${listingId}`);
         return { success: true, data: t("listingEditedSuccessfully") };
      } catch (error) {
         Sentry.captureException(error);
         return {
            success: false,
            error: t("failedToUpdateListing"),
         };
      }
   }
);
