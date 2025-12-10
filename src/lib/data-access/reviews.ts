"use server";
import { getUser, withAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { CreateReview, TPublicReview } from "@/utils/zod-schemas/reviews";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import * as Sentry from "@sentry/nextjs";

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

export const createReview = withAuth(
   async (data: CreateReview): Promise<Result<CreateReview>> => {
      const tReviews = await getTranslations("reviews");
      const currentUser = await getUser();
      if (!currentUser) {
         return { success: false, error: "Unauthorized" };
      }

      if (currentUser.id === data.revieweeId) {
         return {
            success: false,
            error: tReviews("errors.cannotReviewYourself"),
         };
      }

      try {
         const review = await prisma.review.create({
            data: {
               rating: data.rating,
               comment: data.comment ?? null,
               reviewerId: currentUser.id,
               revieweeId: data.revieweeId,
               ...(data.listingId && { listingId: data.listingId }),
            },
            include: {
               reviewer: {
                  select: {
                     name: true,
                     avatarImg: true,
                  },
               },
            },
         });
         return { success: true, data: review as CreateReview };
      } catch (error) {
         Sentry.captureException(error);
         return {
            success: false,
            error: tReviews("errors.failedToCreateReview"),
         };
      }
   }
);

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
