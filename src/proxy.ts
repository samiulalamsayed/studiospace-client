import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const sessionCookie =
        request.cookies.get("better-auth.session_token") ||
        request.cookies.get("__Secure-better-auth.session_token");

    const isAuthenticated = !!sessionCookie;

    const loginUrl = new URL("/login", request.url);

    // Preserve the requested URL
    loginUrl.searchParams.set(
        "callbackURL",
        request.nextUrl.pathname
    );

    if (!isAuthenticated) {
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
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