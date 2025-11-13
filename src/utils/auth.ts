import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: "postgresql",
   }),
   emailAndPassword: {
      enabled: true,
   },
   plugins: [nextCookies()],
   baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
   basePath: "/api/auth",
   trustedOrigins: process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : undefined,
});

export async function requireAuth() {
   const user = await getUserFromCookie();

   if (!user) {
      redirect("/auth/login");
   }

   return user;
}

export async function getUserFromCookie(req?: NextRequest) {
   const session = await auth.api.getSession({
      headers: req ? req.headers : await headers(),
   });

   if (!session?.user) {
      return null;
   }

   return session.user;
}