import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./utils/auth";

export default createMiddleware(routing);

export async function proxy(req: NextRequest) {
   const pathname = req.nextUrl.pathname;

   const protectedRoutes = [
      "/listings/create",
      "/messages",
      "/favorites",
   ];

   const exactProtectedRoutes = [
      "/profile",
   ];

   const isProtectedRoute = 
      protectedRoutes.some((route) => pathname.startsWith(route)) ||
      exactProtectedRoutes.includes(pathname);

   if (isProtectedRoute) {
      const session = await auth.api.getSession({
         headers: req.headers,
      });

      if (!session?.user) {
         const loginUrl = new URL("/auth/login", req.url);
         return NextResponse.redirect(loginUrl);
      }
   }

   return NextResponse.next();
}

export const config = {
   matcher: ["/((?!api|trpc|_next|_vercel|auth|.*\\..*).*)"],
};

