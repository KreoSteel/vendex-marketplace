"use server";
import { Result } from "@/types/result";
import { TPublicReview } from "@/app/entities/reviews";
import prisma from "@/app/shared/api/prisma";

export async function getReviews(
    userId: string
 ): Promise<Result<TPublicReview[]>> {
    const reviews = await prisma.review.findMany({
       where: {
          revieweeId: userId,
       },
       orderBy: {
          createdAt: "desc",
       },
       include: {
          reviewer: {
             select: {
                id: true,
                name: true,
                avatarImg: true,
             },
          },
          reviewee: {
             select: {
                id: true,
                name: true,
                avatarImg: true,
             },
          },
          listing: {
             select: {
                id: true,
                title: true,
             },
          },
       },
    });
    return { success: true, data: reviews as TPublicReview[] };
 }
 
 export async function getReviewsStats(
    userId: string
 ): Promise<Result<{ averageRating: number; totalReviews: number }>> {
    const result = await prisma.review.aggregate({
       where: {
          revieweeId: userId,
       },
       _avg: {
          rating: true,
       },
       _count: {
          _all: true,
       },
    });
 
    return {
       success: true,
       data: {
          averageRating: result._avg.rating || 0,
          totalReviews: result._count._all || 0,
       },
    };
 }