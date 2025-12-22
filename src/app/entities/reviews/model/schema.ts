import { z } from "zod";
import { userSchema } from "@/app/entities/user";
import { listingSchema } from "@/app/entities/listings";

export const reviewSchema = z.object({
    id: z.string().min(1),
    rating: z.number().min(1).max(5),
    comment: z.string().trim().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    reviewer: userSchema,
    reviewee: userSchema,
    listing: listingSchema.nullable().optional(),
})

export const publicReviewSchema = z.object({
    id: z.string(),
    rating: z.number(),
    comment: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    reviewer: z.object({
        id: z.string(),
        name: z.string().nullable(),
        avatarImg: z.string().nullable(),
    }),
    reviewee: z.object({
        id: z.string(),
        name: z.string().nullable(),
        avatarImg: z.string().nullable(),
    }),
    listing: z.object({
        id: z.string(),
        title: z.string(),
    }).nullable().optional(),
});


export const createReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    revieweeId: z.string(),
    listingId: z.string().min(1).optional(),
    comment: z.string().trim().nullable().optional(),
})

export type CreateReview = z.infer<typeof createReviewSchema>;
export type TReview = z.infer<typeof reviewSchema>;
export type TPublicReview = z.infer<typeof publicReviewSchema>;
