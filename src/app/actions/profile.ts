"use server";

import { updateUserProfile } from "@/lib/data-access/profile";
import { uploadProfileImage } from "@/lib/storage/upload";
import { requireAuth } from "@/utils/auth";
import { TUpdateUserProfile, updateUserProfileSchema } from "@/utils/zod-schemas/profile";

export async function updateUserProfileAction(
   formData: FormData
): Promise<{ error: string } | { success: string }> {
   const currentUser = await requireAuth();
   const file = formData.get("avatarImg") as File;

   const { url, error: uploadError } = await uploadProfileImage(
      file,
      currentUser.id
   );
   if (uploadError) {
      return { error: uploadError };
   }

   const data: Partial<TUpdateUserProfile> = {
      avatarImg: url,
   };
   
   const name = formData.get("name");
   const location = formData.get("location");
   const phone = formData.get("phone");

   if (name && typeof name === "string") data.name = name;
   if (location && typeof location === "string") data.location = location;
   if (phone && typeof phone === "string") data.phone = phone;

   const validatedData = updateUserProfileSchema.safeParse(data);
   if (!validatedData.success) {
      return { error: validatedData.error.message };
   }

   try {
      await updateUserProfile(currentUser.id, validatedData.data);
      return { success: "Profile updated successfully" };
   } catch (error) {
      return {
         error:
            error instanceof Error ? error.message : "Failed to update profile",
      };
   }
}
