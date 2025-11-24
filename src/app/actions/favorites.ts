"use server";

import { toggleFavorite } from "@/lib/data-access/favorites";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(listingId: string) {
   try {
      const result = await toggleFavorite(listingId);

      revalidatePath("/profile");
      revalidatePath("/favorites");
      revalidatePath("/listings");
      revalidatePath(`/listings/${listingId}`);
      
      return result;
   } catch (error) {
      console.error("Failed to toggle favorite:", error);
      return {
         success: false,
         message: "Failed to toggle favorite: " + (error instanceof Error ? error.message : "Unknown error"),
      };
   }
}
