"use server";

import { updateUserProfile } from "@/app/entities/user";
import { uploadProfileImage } from "@/app/shared/api/storage/upload";
import { getUser, withAuth } from "@/app/shared/api/auth/auth";
import { updateUserProfileSchema } from "@/app/features/update-profile";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import * as Sentry from "@sentry/nextjs";

export const updateAvatarAction = withAuth(
   async (
      _prevState: Result<string> | undefined,
      formData: FormData
   ): Promise<Result<string>> => {
      const t = await getTranslations("profile.errors");
      const currentUser = await getUser();
      const file = formData.get("avatarImg") as File;
      if (!file || file.size === 0) {
         return { success: false, error: t("noFileProvided") };
      }

      if (file.size > 1024 * 1024 * 5) {
         return { success: false, error: t("fileSizeTooLarge") };
      }

      if (!currentUser) {
         return { success: false, error: "Unauthorized" };
      }

      const uploadResult = await uploadProfileImage(file, currentUser.id);
      if (!uploadResult.success) {
         return { success: false, error: uploadResult.error };
      }
      const url = uploadResult.data;

      const parsed = updateUserProfileSchema.safeParse({ avatarImg: url });
      if (!parsed.success) {
         return { success: false, error: parsed.error.message };
      }

      try {
         await updateUserProfile(currentUser.id, parsed.data);
         revalidatePath("/profile");
         return { success: true, data: t("profileImageUpdatedSuccessfully") };
      } catch (error) {
         Sentry.captureException(error);
         return { success: false, error: t("failedToUpdateProfileImage") };
      }
   }
);
