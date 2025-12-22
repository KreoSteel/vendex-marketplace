"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import prisma from "@/app/shared/api/prisma";
import { TUpdateUserProfile } from "@/app/features/update-profile";

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