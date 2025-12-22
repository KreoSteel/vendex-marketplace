"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { updateUserProfileSchema } from "../model/types";
import { updateUserProfile } from "@/app/entities/user";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";

export const updateUserProfileAction = withAuth(
   async (
      _prevState: Result<string> | undefined,
      formData: FormData
   ): Promise<Result<string>> => {
      const t = await getTranslations("profile.errors");
      const currentUser = await getUser();

      const parsed = updateUserProfileSchema.safeParse({
         name: formData.get("name") as string,
         location: formData.get("location") as string,
         phone: formData.get("phone") as string,
      });

      if (!parsed.success) {
         return { success: false, error: parsed.error.message };
      }

      if (!currentUser) {
         return { success: false, error: "Unauthorized" };
      }
      try {
         await updateUserProfile(currentUser.id, parsed.data);
         revalidatePath("/profile");
         return { success: true, data: t("profileUpdatedSuccessfully") };
      } catch (error) {
         Sentry.captureException(error);
         return { success: false, error: t("failedToUpdateProfile") };
      }
   }
);
