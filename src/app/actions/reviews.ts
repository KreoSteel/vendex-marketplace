"use server";
import { createReview } from "@/lib/data-access/reviews";
import { requireAuth } from "@/utils/auth";
import { createReviewSchema } from "@/utils/zod-schemas/reviews";
import { revalidatePath } from "next/cache";

type ActionState =
   | { error: string; success?: string }
   | { success: string; error?: string }
   | null;

export async function createReviewAction(
   prevState: ActionState,
   formData: FormData
) {
   await requireAuth();

   const data = {
      rating: Number(formData.get("rating")),
      comment: formData.get("comment") as string | undefined,
      revieweeId: formData.get("revieweeId") as string,
      listingId: (formData.get("listingId") as string | null) || undefined,
   };

   const validatedData = createReviewSchema.safeParse(data);
   if (!validatedData.success) {
      return { error: validatedData.error.message };
   }

   try {
      const result = await createReview(validatedData.data);
      if (result.error) {
         return { error: result.error };
      }

      revalidatePath(`/profile/${validatedData.data.revieweeId}`);
      if (validatedData.data.listingId) {
         revalidatePath(`/listings/${validatedData.data.listingId}`);
      }

      return { success: "Review created successfully" };
   } catch (error) {
      console.error("Create review error:", error);
      return { error: "Failed to create review" };
   }
}
