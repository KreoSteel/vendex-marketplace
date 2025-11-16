import { z } from "zod";
import { ListingCondition } from "@prisma/client";

export const createListingSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().max(1000, { message: "Description must be less than 1000 characters" }).optional(),
    price: z.number().max(1000000, { message: "Price must be less than 1000000" }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    condition: z.enum(ListingCondition).default("USED"),
    images: z.array(z.string()).min(1, { message: "At least one image is required" }).max(10, { message: "You can only upload up to 10 images" }),
});

export const listingSchema = z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    location: z.string(),
    condition: z.enum(ListingCondition),
    createdAt: z.date(),
    updatedAt: z.date(),
    images: z.array(z.object({
        url: z.string(),
    })),
});


export type TCreateListing = z.infer<typeof createListingSchema>;
export type TListing = z.infer<typeof listingSchema>;