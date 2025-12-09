import { z } from "zod";

export const updateUserProfileSchema = z.object({
    name: z.string().trim().optional(),
    location: z.string().trim().nullable().optional(),
    phone: z.string().trim().nullable().optional(),
    avatarImg: z.url().nullable().optional(),
});

export const userProfileSchema = z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    phone: z.string(),
    avatarImg: z.url(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    email: z.email(),
});
export type TUpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type TUserProfile = z.infer<typeof userProfileSchema>;