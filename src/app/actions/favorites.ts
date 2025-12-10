"use server";

import { toggleFavorite } from "@/lib/data-access/favorites";
import { withAuth } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import * as Sentry from "@sentry/nextjs";
import { Result } from "@/types/result";

export const toggleFavoriteAction = withAuth(async (
   listingId: string
): Promise<Result<string>> => {
   try {
      const result = await toggleFavorite(listingId);

      revalidatePath("/profile");
      revalidatePath("/favorites");
      revalidatePath("/listings");
      revalidatePath(`/listings/${listingId}`);
      
      return result;
   } catch (error) {
      const t = await getTranslations("favorites.errors");
      Sentry.captureException(error)
      return {
         success: false,
         error: t("failedToToggleFavorite") + (error instanceof Error ? error.message : t("unknownError")),
      };
   }
});
