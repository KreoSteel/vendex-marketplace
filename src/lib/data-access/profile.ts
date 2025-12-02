"use server";
import { getUser, requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { TUpdateUserProfile } from "@/utils/zod-schemas/profile";
import { getTranslations } from "next-intl/server";

export async function getUserProfile(userId?: string) {
   const currentUser = await getUser();
   if (!userId && !currentUser) {
      return null;
   }
   const targetUserId = userId || currentUser!.id;

   return await prisma.user.findUnique({
      where: {
         id: targetUserId,
      },
   });
}

export async function updateUserProfile(
   userId: string,
   data: Partial<TUpdateUserProfile>
) {
   const tProfile = await getTranslations("profile");
   const currentUser = await requireAuth();
   
   if (currentUser.id !== userId) {
      return { error: tProfile("errors.updateProfileError") };
   }

   return await prisma.user.update({
      where: { id: userId },
      data: {
         name: data.name,
         location: data.location,
         phone: data.phone,
         avatarImg: data.avatarImg,
      },
   });
}
