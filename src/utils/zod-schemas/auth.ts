import { z } from "zod";

export const userSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.email({ message: "Invalid email address" }),
    avatarImg: z.url({ message: "Invalid avatar image URL" }),
    location: z.string().min(1),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    emailVerified: z.boolean(),
    phone: z.string().min(1),
});




export type User = z.infer<typeof userSchema>;