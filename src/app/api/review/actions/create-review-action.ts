"use server";
import { createReview } from "@/lib/data-access/reviews";
import { getUser, withAuth } from "@/app/shared/api/auth/auth";
import { createReviewSchema } from "@/utils/zod-schemas/reviews";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import * as Sentry from "@sentry/nextjs";

export const createReviewAction = withAuth(async (
   _prevState: Result<string> | undefined,
   formData: FormData
): Promise<Result<string>> => {
   const tReviews = await getTranslations("reviews");
   const currentUser = await getUser();
   if (!currentUser) {
      return { success: false, error: "Unauthorized" };
   }
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

   if (validatedData.data.revieweeId === currentUser.id) {
      return { success: false, error: tReviews("errors.cannotReviewYourself") };
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

      return { success: true, data: tReviews("success.reviewCreatedSuccessfully") };
   } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: tReviews("errors.failedToCreateReview") };
   }
});
