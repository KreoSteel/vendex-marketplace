import { z } from "zod";

export const updateUserProfileSchema = z.object({
    name: z.string().trim().nullable().optional(),
    location: z.string().trim().nullable().optional(),
    phone: z.string().trim().nullable().optional(),
    avatarImg: z.url().nullable().optional(),
});


export type TUpdateUserProfile = z.infer<typeof updateUserProfileSchema>;