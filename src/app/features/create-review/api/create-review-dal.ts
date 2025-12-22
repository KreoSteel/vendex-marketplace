"use server";
import { withAuth } from "@/app/shared/api/auth/auth";
import { getUser } from "@/app/shared/api/auth/auth";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";
import { CreateReview } from "@/app/entities/reviews";
import prisma from "@/app/shared/api/prisma";
import * as Sentry from "@sentry/nextjs";

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