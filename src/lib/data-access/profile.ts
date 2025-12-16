"use server";
import { getUser, withAuth } from "@/app/shared/api/auth/auth";
import prisma from "@/app/shared/api/prisma";
import { TUpdateUserProfile, TUserProfile } from "@/utils/zod-schemas/profile";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";

export async function getUserProfile(
   userId?: string
): Promise<Result<TUserProfile | null>> {
   const currentUser = await getUser();
   if (!userId && !currentUser) {
      return { success: false, error: "User not found" };
   }
   const targetUserId = userId || currentUser!.id;

   const user = await prisma.user.findUnique({
      where: {
         id: targetUserId,
      },
      select: {
         id: true,
         name: true,
         location: true,
         phone: true,
         avatarImg: true,
         createdAt: true,
      },
   });
   return { success: true, data: user as TUserProfile };
}

export const updateUserProfile = withAuth(async (
   userId: string,
   data: Partial<TUpdateUserProfile>
): Promise<Result<TUpdateUserProfile>> => {
   const t = await getTranslations("profile.errors");
   const currentUser = await getUser();

   if (!currentUser) {
      return { success: false, error: t("unauthorizedAccess") };
}

   if (currentUser.id !== userId) {
      return { success: false, error: t("failedToUpdateProfile") };
   }

   const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
         name: data.name,
         location: data.location,
         phone: data.phone,
         avatarImg: data.avatarImg,
      },
   });
   return { success: true, data: updatedUser as TUpdateUserProfile };
});
