import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { Result } from "@/types/result";
import { User } from "./zod-schemas/auth";
import { toast } from "sonner";
import { getTranslations } from "next-intl/server";
import * as Sentry from "@sentry/nextjs";

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: "postgresql",
   }),
   emailAndPassword: {
      enabled: true,
   },
   plugins: [nextCookies()],
});

export async function requireAuth(options?: { redirect?: boolean }): Promise<Result<User>> {
   const user = await getUser();
   if (!user) {
      if (options?.redirect !== false) {
         redirect({ href: "/auth/login", locale: "en" });
      }
      return { success: false, error: "Unauthorized" };
   }
   return { success: true, data: user} ;
}

export async function getUser(req?: NextRequest): Promise<User | null> {
   try {
      const session = await auth.api.getSession({
         headers: req ? req.headers : await headers(),
      });

      if (!session?.user) {
         return null;
      }

      return prisma.user.findUnique({
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
      }) as Promise<User>;
   } catch (error) {
      Sentry.captureException(error);
      return null;
   }
}

export function withAuth<T extends (...args: any[]) => Promise<any>>(fn: T): T {
   return (async (...args: Parameters<T>) => {
     const user = await requireAuth();
     if (!user.success) return user;
     return fn(...args);
   }) as T;
 }