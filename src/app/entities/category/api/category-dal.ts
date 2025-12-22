"use server";
import prisma from "@/app/shared/api/prisma";

export async function getAllCategories() {
    return prisma.category.findMany();
}