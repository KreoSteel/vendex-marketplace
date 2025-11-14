import { NextRequest, NextResponse } from "next/server";
import { auth } from "./utils/auth";
import { headers } from "next/headers";

export async function proxy(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        const loginUrl = new URL("/auth/login", req.url)
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*|.*/login|.*/register).*)"],
 };