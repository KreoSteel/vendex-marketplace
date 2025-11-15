import { requireAuth } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { Category } from "@prisma/client";

export async function getAllCategories() {
    return await prisma.category.findMany();
}

