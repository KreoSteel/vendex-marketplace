"use server";
import {
   createListing,
   deleteListing,
   markListingAsSold,
   updateListing,
} from "@/lib/data-access/listings";
import { uploadListingImages } from "@/lib/storage/upload";
import { getUser, withAuth } from "@/utils/auth";
import {
   createListingSchema,
   TCreateListingResult,
   updateListingSchema,
} from "@/utils/zod-schemas/listings";
import { ListingCondition } from "@/utils/generated/enums";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import * as Sentry from "@sentry/nextjs";

export const createListingAction = withAuth(async (
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
});

export const updateListingAction = withAuth(async (
   _prevState: Result<string> | undefined,
   formData: FormData
): Promise<Result<string>> => {
   const t = await getTranslations("listings.errors");
   const tSystem = await getTranslations("system");
   const currentUser = await getUser();
   const files = formData.getAll("images") as File[];
   const existingImages: string[] = formData
      .getAll("existingImages")
      .filter((item): item is string => typeof item === "string" && item.trim() !== "") as string[];

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
      const editedListing = await updateListing(listingId, validatedData.data);
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
});

export const deleteListingAction = withAuth(async (
   listingId: string
): Promise<Result<string>> => {
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
});

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
