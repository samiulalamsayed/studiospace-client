import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const sessionCookie =
        request.cookies.get("better-auth.session_token") ||
        request.cookies.get("__Secure-better-auth.session_token");

    const isAuthenticated = !!sessionCookie;

    // User is authenticated
    if (isAuthenticated) {
        return NextResponse.next();
    }

    // User is not authenticated
    const loginUrl = new URL("/login", request.url);

    // Preserve pathname and query parameters
    const callbackURL =
        request.nextUrl.pathname + request.nextUrl.search;

    loginUrl.searchParams.set("callbackURL", callbackURL);

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/add-studio/:path*",
        "/my-listings/:path*",
        "/my-bookings/:path*",
        "/studios/edit/:path*",
    ],
};