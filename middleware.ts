// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokens } from './app/helper/jwt';


export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    // 🛑 Routes to protect (you can customize)
    const protectedRoutes = ['/admin', '/form'];

    // 🌍 Public routes (skip protection)
    const publicRoutes = ['/'];

    // if (publicRoutes.some((route) => pathname.startsWith(route))) {
    //     return NextResponse.next();
    // }

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


    // If no token → redirect to home
    if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Validate JWT signature and expiration
    const isValid = await verifyTokens(token);
    if (!isValid) {
        // Token is expired or tampered
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (token && isValid) {
        console.log(true)
    }

    // ✅ All good — proceed
    return NextResponse.next();
}

// Configure which paths this middleware applies to
export const config = {
    matcher: ['/form/:path*', '/admin/:path*'],
};

