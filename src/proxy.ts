import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./pkg/i18n/routing";
import { auth } from "./app/shared/api/auth/auth";

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
   const response = intlMiddleware(req);
   const { pathname } = req.nextUrl;
   const localeMatch = pathname.split("/")[1];
   const locale =
      routing.locales.find((loc) => loc === localeMatch) ??
      routing.defaultLocale;

   const protectedRoutes = ["/listings/create", "/messages", "/favorites"];

   const exactProtectedRoutes = ["/profile"];

   const isLocale = routing.locales.some((loc) => loc === localeMatch);
   const normalizedPath = isLocale
      ? pathname.replace(`/${locale}`, "") || "/"
      : pathname;

   const isProtectedRoute =
      protectedRoutes.some((route) => normalizedPath.startsWith(route)) ||
      exactProtectedRoutes.includes(normalizedPath);

   if (isProtectedRoute) {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) {
         const loginUrl = new URL(`/${locale}/auth/login`, req.url);
         return NextResponse.redirect(loginUrl);
      }
   }

   return response;
}

export const config = {
   matcher: ["/((?!api|trpc|_next|_vercel|auth|.*\\..*).*)"],
};
