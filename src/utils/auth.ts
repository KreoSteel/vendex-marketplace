import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: "postgresql",
   }),
   emailAndPassword: {
      enabled: true,
   },
   plugins: [nextCookies()],
});

export async function requireAuth(options?: { redirect?: boolean }) {
   const user = await getUser();

   if (!user) {
      if (options?.redirect !== false) {
         redirect({ href: "/auth/login", locale: "en" });
      }
      throw new Error("Unauthorized");
   }

   return user;
}

export async function getUser(req?: NextRequest) {
   try {
      const session = await auth.api.getSession({
         headers: req ? req.headers : await headers(),
      });

      if (!session?.user) {
         return null;
      }

      return await prisma.user.findUnique({
         where: {
            id: session.user.id,
         },
         select: {
            id: true,
            email: true,
            name: true,
            avatarImg: true,
            location: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            phone: true,
         },
      });
   } catch (error) {
      console.error(error);
      return null;
   }
}
