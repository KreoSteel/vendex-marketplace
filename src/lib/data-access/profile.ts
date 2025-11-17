import { getUser, requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { TUpdateUserProfile } from "@/utils/zod-schemas/profile";

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
   data: TUpdateUserProfile
) {
   const currentUser = await requireAuth();
   if (currentUser.id !== userId) {
      throw new Error("You are not authorized to update this profile");
   }

   return await prisma.user.update({
      where: { id: userId },
      data,
   });
}
