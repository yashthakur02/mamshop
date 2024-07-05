import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"

import { NextResponse } from "next/server";
import { adminRoutesPrefix, apiAuthPrefix, authRoutes, DEFAULT_AUTH_URL, DEFAULT_REDIRECT_URL, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig)
export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth


    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    const isAdminRoutes = nextUrl.pathname.startsWith(adminRoutesPrefix)
    if (isApiAuthRoute) return NextResponse.next()

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_REDIRECT_URL, nextUrl))
        }
        return NextResponse.next()
    }

    // if (!isLoggedIn && isAdminRoutes) return Response.redirect(new URL(DEFAULT_AUTH_URL, nextUrl))

    return NextResponse.next()
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};