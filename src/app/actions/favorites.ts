"use server";

import { toggleFavorite } from "@/lib/data-access/favorites";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
export async function toggleFavoriteAction(listingId: string) {
   try {
      const result = await toggleFavorite(listingId);

      revalidatePath("/profile");
      revalidatePath("/favorites");
      revalidatePath("/listings");
      revalidatePath(`/listings/${listingId}`);
      
      return result;
   } catch (error) {
      const t = await getTranslations("favorites.errors");
      console.error(t("failedToToggleFavorite"), error);
      return {
         success: false,
         error: t("failedToToggleFavorite") + (error instanceof Error ? error.message : t("unknownError")),
      };
   }
}
