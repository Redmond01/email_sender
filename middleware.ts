// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessTokens } from './app/server/helper/jwt';



export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 🛑 Routes to protect (you can customize)
    const protectedRoutes = ['/admin', '/form', '/email'];

    // 🌍 Public routes (skip protection)
    const publicRoutes = ['/', '/api/refresh'];

    // Skip middleware for public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Check if this is a protected route
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    if (!isProtected) {
        return NextResponse.next();
    }

    // Get accessToken from cookies
    const token = req.cookies.get('accessToken')?.value;
    const fallbackToken = req.cookies.get('refreshToken')?.value


    // check for token and redirect to refresh route for token update
    if (!token && !fallbackToken) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (token) {
        const isValid = await verifyAccessTokens(token);
        if (isValid) return NextResponse.next()
    }

    if (fallbackToken) {
        const redirectUrl = `${process.env.NEXT_PUBLIC_LOGINROUTE}/api/refresh?redirect=${encodeURIComponent(req.nextUrl.pathname)}`
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }


    // final fallback
    return NextResponse.next()

}


// Configure which paths this middleware applies to
export const config = {
    matcher: ['/form/:path*', '/admin/:path*', '/email/:path*'],
};

