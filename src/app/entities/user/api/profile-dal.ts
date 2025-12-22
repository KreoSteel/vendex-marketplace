"use server";
import { getUser } from "@/app/shared/api/auth/auth";
import prisma from "@/app/shared/api/prisma";
import { TUserProfile } from "@/app/features/update-profile";
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

