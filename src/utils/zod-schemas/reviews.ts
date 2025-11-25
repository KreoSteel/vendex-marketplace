import { z } from "zod";
import { userSchema } from "./auth";
import { listingSchema } from "./listings";

export const reviewSchema = z.object({
    id: z.string().min(1),
    rating: z.number().min(1).max(5),
    comment: z.string().trim().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    reviewer: userSchema,
    reviewee: userSchema,
    listing: listingSchema,
})

export const createReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    revieweeId: z.string(),
    listingId: z.string().min(1),
    comment: z.string().trim().nullable().optional(),
})

export type CreateReview = z.infer<typeof createReviewSchema>;
export type TReview = z.infer<typeof reviewSchema>;