"use server";
import prisma from "@/utils/prisma";

export async function getAllCategories() {
    return prisma.category.findMany();
}