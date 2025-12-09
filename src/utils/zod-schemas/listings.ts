import { z } from "zod";
import { ListingCondition, ListingStatus } from "../generated/enums";
import { categorySchema } from "./categories";

export const createListingSchema = z.object({
   title: z.string().min(1, { message: "Title is required" }),
   description: z
      .string()
      .max(1000, { message: "Description must be less than 1000 characters" })
      .optional(),
   price: z
      .number()
      .max(1000000, { message: "Price must be less than 1000000" }),
   categoryId: z.string().min(1, { message: "Category is required" }),
   location: z.string().min(1, { message: "Location is required" }),
   condition: z.enum(ListingCondition).default("USED"),
   images: z
      .array(z.string())
      .min(1, { message: "At least one image is required" })
      .max(10, { message: "You can only upload up to 10 images" }),
});

export const updateListingSchema = z
   .object({
      title: z.string().min(1, { message: "Title is required" }),
      description: z
         .string()
         .max(1000, {
            message: "Description must be less than 1000 characters",
         })
         .optional(),
      price: z
         .number()
         .max(1000000, { message: "Price must be less than 1000000" }),
      location: z.string().min(1, { message: "Location is required" }),
      condition: z.enum(ListingCondition).default("USED"),
      images: z
         .array(z.string())
         .min(1, { message: "At least one image is required" })
         .max(10, { message: "You can only upload up to 10 images" }),
   })
   .partial();

export const recentListingsSchema = z.object({
   id: z.string(),
   title: z.string(),
   price: z.number().nullable(),
   location: z.string().nullable(),
   condition: z.enum(ListingCondition),
   createdAt: z.date(),
   images: z.array(
      z.object({
         url: z.string(),
      })
   ),
});

export const listingSchema = z.object({
   id: z.string(),
   title: z.string(),
   description: z.string().nullable(),
   category: categorySchema,
   price: z.number().nullable(),
   featured: z.boolean(),
   location: z.string().nullable(),
   condition: z.enum(ListingCondition),
   status: z.enum(ListingStatus).optional(),
   createdAt: z.date(),
   updatedAt: z.date(),
   images: z.array(
      z.object({
         url: z.string(),
      })
   ),
   user: z.object({
      id: z.string(),
      name: z.string(),
      avatarImg: z.string(),
      location: z.string(),
      createdAt: z.date(),
   }),
});

export const paginationListingsSchema = z.object({
   listings: z
      .array(listingSchema)
      .min(1, { message: "There must be at least one listing" }),
   currentPage: z
      .number()
      .min(1, { message: "Current page must be greater than 0" }),
   itemsPerPage: z
      .number()
      .min(1, { message: "Items per page must be greater than 0" }),
   totalPages: z
      .number()
      .min(1, { message: "Total pages must be greater than 0" }),
   totalItems: z
      .number()
      .min(0, { message: "Total items must be greater than 0" }),
});

export const ListingsCardSchema = listingSchema.pick({
   id: true,
   title: true,
   price: true,
   location: true,
   condition: true,
   createdAt: true,
   images: true,
});

export const CreateListingResultSchema = z.object({
   description: z.string(),
   userId: z.string(),
   images: z.array(z.object({
      url: z.string(),
      order: z.number(),
   })),
   title: z.string(),
   price: z.number(),
   categoryId: z.string(),
   location: z.string(),
   condition: z.enum(ListingCondition),
});

export type TCreateListingResult = z.infer<typeof CreateListingResultSchema>;
export type TUpdateListing = z.infer<typeof updateListingSchema>;
export type TCreateListing = z.infer<typeof createListingSchema>;
export type TListing = z.infer<typeof listingSchema>;
export type TRecentListings = z.infer<typeof recentListingsSchema>;
export type TListingsCard = z.infer<typeof ListingsCardSchema>;
export type TPaginationListings = z.infer<typeof paginationListingsSchema>;