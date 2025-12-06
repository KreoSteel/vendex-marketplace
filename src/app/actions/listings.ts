"use server";
import {
   createListing,
   deleteListing,
   markListingAsSold,
   updateListing,
} from "@/lib/data-access/listings";
import { uploadListingImages } from "@/lib/storage/upload";
import { requireAuth } from "@/utils/auth";
import {
   createListingSchema,
   updateListingSchema,
} from "@/utils/zod-schemas/listings";
import { ListingCondition } from "@/utils/generated/enums";
import { revalidatePath } from "next/cache";

type ActionState =
   | { error: string; success?: string }
   | { success: string; error?: string }
   | undefined;

export async function createListingAction(
   prevState: ActionState,
   formData: FormData
): Promise<{ error: string } | { success: string }> {
   const currentUser = await requireAuth();
   const files = formData.getAll("images") as File[];

   const { urls, error: uploadError } = await uploadListingImages(
      files,
      currentUser.id
   );
   if (uploadError) {
      return { error: uploadError };
   }

   const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) ?? "No description provided",
      price: (formData.get("price") as string)
         ? parseFloat(formData.get("price") as string)
         : 0,
      categoryId: formData.get("category") as string,
      location: formData.get("location") as string,
      condition: formData.get("condition") as ListingCondition,
      images: urls,
   };

   if (isNaN(data.price) || data.price < 0) {
      return { error: "Invalid price" };
   }

   const validatedData = createListingSchema.safeParse(data);
   if (!validatedData.success) {
      return { error: validatedData.error.message };
   }

   try {
      const listing = await createListing(validatedData.data);
      if ("error" in listing) {
         return { error: listing.error as string };
      }
      return { success: listing.id };
   } catch (error) {
      console.error("Create listing error:", error);
      return {
         error:
            error instanceof Error ? error.message : "Failed to create listing",
      };
   }
}

export async function updateListingAction(
   prevState: ActionState,
   formData: FormData
): Promise<{ error: string } | { success: string }> {
   const currentUser = await requireAuth();
   const files = formData.getAll("images") as File[];
   const existingImages: string[] = formData
      .getAll("existingImages")
      .filter((item): item is string => typeof item === "string") as string[];

   const { urls = [], error: uploadError } = await uploadListingImages(
      files,
      currentUser.id
   );

   if (uploadError) {
      return { error: uploadError };
   }

   const listingId = formData.get("id") as string;
   if (!listingId) {
      return { error: "Listing ID is required" };
   }

   const data = {
      title: formData.get("title") as string,
      description:
         (formData.get("description") as string) ?? "No description provided",
      price: formData.get("price")
         ? parseFloat(formData.get("price") as string)
         : 0,
      location: formData.get("location") as string,
      condition: formData.get("condition") as ListingCondition,
      images: [...existingImages, ...urls],
   };

   const validatedData = updateListingSchema.safeParse(data);

   if (!validatedData.success) {
      return { error: validatedData.error.message };
   }

   try {
      const editedListing = await updateListing(listingId, validatedData.data);
      if ("error" in editedListing) {
         return { error: editedListing.error as string };
      }

      revalidatePath(`/listings/${listingId}`);
      return { success: "Listing edited successfully" };
   } catch (error) {
      console.error("Update listing error:", error);
      return {
         error:
            error instanceof Error ? error.message : "Failed to update listing",
      };
   }
}

export async function deleteListingAction(listingId: string) {
   try {
      const deletedListing = await deleteListing(listingId);

      if ("error" in deletedListing) {
         return { error: deletedListing.error as string };
      }

      revalidatePath("/profile");
      revalidatePath("/listings");
      revalidatePath(`/listings/${listingId}`);

      return { success: "Listing deleted successfully" };
   } catch (error) {
      console.error("Delete listing error:", error);
      return {
         error:
            error instanceof Error ? error.message : "Failed to delete listing",
      };
   }
}

export async function markListingAsSoldAction(listingId: string) {
   try {
      const markedListing = await markListingAsSold(listingId);
      if ("error" in markedListing) {
         return { error: markedListing.error as string };
      }

      revalidatePath("/profile");
      revalidatePath(`/listings/${listingId}`);
      return {
         success: "Listing marked as sold successfully",
         id: markedListing.id,
      };
   } catch (error) {
      console.error("Mark listing as sold error:", error);
      return {
         error:
            error instanceof Error
               ? error.message
               : "Failed to mark listing as sold",
      };
   }
}
