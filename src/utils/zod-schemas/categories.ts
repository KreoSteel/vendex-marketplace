import { z } from "zod";

export const categorySchema = z.object({
    id: z.string().min(1, { message: "ID is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    icon: z.string().min(1, { message: "Icon is required" }),
    slug: z.string().optional(),
});

export type TCategory = z.infer<typeof categorySchema>;