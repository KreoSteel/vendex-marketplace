"use server";
import { createReview } from "@/lib/data-access/reviews";
import { requireAuth } from "@/utils/auth";
import { createReviewSchema } from "@/utils/zod-schemas/reviews";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";

export async function createReviewAction(
   _prevState: Result<string> | undefined,
   formData: FormData
): Promise<Result<string>> {
   const tReviews = await getTranslations("reviews");
   await requireAuth();

   const data = {
      rating: Number(formData.get("rating")),
      comment: formData.get("comment") as string | undefined,
      revieweeId: formData.get("revieweeId") as string,
      listingId: (formData.get("listingId") as string | null) || undefined,
   };

   const validatedData = createReviewSchema.safeParse(data);
   if (!validatedData.success) {
      return { success: false, error: validatedData.error.message };
   }

   try {
      const result = await createReview(validatedData.data);
      if (!result.success) {
         return { success: false, error: result.error };
      }

      revalidatePath(`/profile/${validatedData.data.revieweeId}`);
      if (validatedData.data.listingId) {
         revalidatePath(`/listings/${validatedData.data.listingId}`);
      }

      return { success: true, data: tReviews("reviewCreatedSuccessfully") };
   } catch (error) {
      console.error(tReviews("failedToCreateReview"), error);
      return { success: false, error: tReviews("failedToCreateReview") };
   }
}
