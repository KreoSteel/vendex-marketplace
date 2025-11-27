"use server";

import { updateUserProfile } from "@/lib/data-access/profile";
import { uploadProfileImage } from "@/lib/storage/upload";
import { requireAuth } from "@/utils/auth";
import { updateUserProfileSchema } from "@/utils/zod-schemas/profile";
import { revalidatePath } from "next/cache";

type ActionState = {
   error?: string;
   success?: string;
} | null;

export async function updateUserProfileAction(
   prevState: ActionState,
   formData: FormData
) {
   const currentUser = await requireAuth();

   const parsed = updateUserProfileSchema.safeParse({
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      phone: formData.get("phone") as string,
   });

   if (!parsed.success) {
      return { error: parsed.error.message };
   }

   try {
      await updateUserProfile(currentUser.id, parsed.data)
      revalidatePath("/profile");
      return { success: "Profile updated successfully" };
   } catch (error) {
      console.error("Failed to update profile", error);
      return { error: "Failed to update profile" };
   }
}

export async function updateUserProfileImageAction(formData: FormData) {
   const currentUser = await requireAuth();
   const file = formData.get("avatarImg") as File;
   if (!file || file.size === 0) {
      return { error: "No file provided" };
   }

   if (file.size > 1024 * 1024 * 5) {
      return { error: "File size must be less than 5MB" };
   }

   const { url, error } = await uploadProfileImage(file, currentUser.id);
   if (error || !url) {
      return { error: error || "Failed to upload image" };
   }

   const parsed = updateUserProfileSchema.safeParse({ avatarImg: url });
   if (!parsed.success) {
      return { error: parsed.error.message };
   }

   try {
      await updateUserProfile(currentUser.id, parsed.data);
      revalidatePath("/profile");
      return { success: "Profile image updated successfully" };
   } catch (error) {
      console.error("Failed to update profile image", error);
      return { error: "Failed to update profile image" };
   }
}
