import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { Result } from "@/types/result";
import { User } from "./zod-schemas/auth";
import * as Sentry from "@sentry/nextjs";
import { getLocale } from "next-intl/server";

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
   const locale = await getLocale();
   if (!user) {
      if (options?.redirect !== false) {
         redirect({ href: "/auth/login", locale: locale });
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

export function withAuth<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: { unauthorizedReturn?: Awaited<ReturnType<T>> }
): T {
  return (async (...args: Parameters<T>) => {
    // If the caller provides an unauthorizedReturn (like []), do NOT redirect.
    const authResult = await requireAuth({
      redirect: options?.unauthorizedReturn === undefined ? undefined : false,
    });

    if (!authResult.success) {
      // If caller wants a non-Result return (like []), return it explicitly.
      if (options?.unauthorizedReturn !== undefined) {
        return options.unauthorizedReturn;
      }

      // Otherwise return a generic Result failure (NOT Result<User>)
      return { success: false, error: authResult.error } as Awaited<ReturnType<T>>;
    }

    return fn(...args);
  }) as T;
}