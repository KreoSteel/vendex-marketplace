"use server";
import { getUser, requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
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
      },
   });
   return { success: true, data: user as TUserProfile };
}

export async function updateUserProfile(
   userId: string,
   data: Partial<TUpdateUserProfile>
): Promise<Result<TUpdateUserProfile>> {
   const t = await getTranslations("listings");
   const currentUser = await requireAuth();

   if (!currentUser.success) {
      return { success: false, error: currentUser.error };
   }

   if (currentUser.data.id !== userId) {
      return { success: false, error: t("errors.updateProfileError") };
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
}
