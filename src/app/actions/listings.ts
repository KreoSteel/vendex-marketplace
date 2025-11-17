"use server";
import { createListing } from "@/lib/data-access/listings";
import { uploadListingImages } from "@/lib/storage/upload";
import { requireAuth } from "@/utils/auth";
import { createListingSchema } from "@/utils/zod-schemas/listings";
import { ListingCondition } from "@prisma/client";

type ActionState =
   | { error: string; success?: string }
   | { success: string; error?: string }
   | null;

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
      description: (formData.get("description") as string) ?? "",
      price: formData.get("price")
         ? parseFloat(formData.get("price") as string)
         : 0,
      categoryId: formData.get("category") as string,
      location: formData.get("location") as string,
      condition: formData.get("condition") as ListingCondition,
      images: urls,
   };

   const validatedData = createListingSchema.safeParse(data);
   if (!validatedData.success) {
      return { error: validatedData.error.message };
   }

   try {
      await createListing(validatedData.data);
      return { success: "Listing created successfully" };
   } catch (error) {
      console.error("Create listing error:", error);
      return {
         error:
            error instanceof Error ? error.message : "Failed to create listing",
      };
   }
}
