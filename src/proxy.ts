import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const sessionCookie =
        request.cookies.get("better-auth.session_token") ||
        request.cookies.get("__Secure-better-auth.session_token");

    const isAuthenticated = !!sessionCookie;
    const { pathname, searchParams } = request.nextUrl;

    // Authenticated users cannot access Login or Register
    if (
        isAuthenticated &&
        (pathname === "/login" || pathname === "/register")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Allow unauthenticated users to access Login and Register
    if (
        !isAuthenticated &&
        (pathname === "/login" || pathname === "/register")
    ) {
        return NextResponse.next();
    }

    // Allow authenticated users to access protected routes
    if (isAuthenticated) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users to Login
    const loginUrl = new URL("/login", request.url);

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
        "/login",
        "/register",
    ],
};