import { z } from "zod";

export const updateUserProfileSchema = z.object({
    name: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    avatarImg: z.string().nullable().optional(),
});

export type TUpdateUserProfile = z.infer<typeof updateUserProfileSchema>;