"use server";
import { requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { CreateReview } from "@/utils/zod-schemas/reviews";
import { getTranslations } from "next-intl/server";
export async function getReviews(userId: string) {
    const tReviews = await getTranslations("reviews");
    return await prisma.review.findMany({
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
}

export async function createReview(data: CreateReview) {
    const tReviews = await getTranslations("reviews");
    const currentUser = await requireAuth();

    if (currentUser.id === data.revieweeId) {
        throw new Error(tReviews("errors.cannotReviewYourself"));
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
                }
            }
        });
        return { success: true, review };
    } catch (error) {
        console.error(tReviews("errors.failedToCreateReview"), error);
        return { error: tReviews("errors.failedToCreateReview") };
    }
}


export async function getReviewsStats(userId: string) {
    const tReviews = await getTranslations("reviews");
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
    })

    return {
        averageRating: result._avg.rating || 0,
        totalReviews: result._count._all || 0,
    }
}


export async function hasUserReviewed(revieweeId: string, listingId?: string) {
    const currentUser = await requireAuth({ redirect: false }).catch(() => null);
    if (!currentUser) return false;

    const review = await prisma.review.count({
        where: {
            reviewerId: currentUser.id,
            revieweeId: revieweeId,
            listingId: listingId ?? undefined,
        },
    });

    return review > 0;
}