import { z } from "zod";

export const updateUserProfileSchema = z.object({
    name: z.string().trim().optional(),
    location: z.string().trim().nullable().optional(),
    phone: z.string().trim().nullable().optional(),
    avatarImg: z.url().nullable().optional(),
});

export const userProfileSchema = z.object({
    id: z.string().min(1),
    name: z.string().nullable(),
    location: z.string().nullable(),
    phone: z.string().nullable(),
    avatarImg: z.string().nullable(),
    createdAt: z.date(),
});

export type TUpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type TUserProfile = z.infer<typeof userProfileSchema>;