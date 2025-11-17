import { NextRequest, NextResponse } from "next/server";
import { auth } from "./utils/auth";

export async function proxy(req: NextRequest) {
   const pathname = req.nextUrl.pathname;

   const protectedRoutes = [
      "/listings/create",
      "/profile",
      "/messages",
      "/favorites",
   ];

   const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
   );

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
   matcher: ["/((?!api|_next|_vercel|auth|.*\\..*).*)"],
};

