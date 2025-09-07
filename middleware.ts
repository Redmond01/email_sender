// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyTokens } from './app/helper/jwt';
import axios from 'axios';
import type { serverRequestConfig } from './app/typemodule';


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
    const fallbackToen = req.cookies.get('refreshToken')?.value


    //check for token and redirect to refresh route for token update
    if (!token && !fallbackToen) {
        return NextResponse.redirect(new URL('/', req.url))
    } else if (!token && fallbackToen) {
        const refreshRoute = process.env.NEXT_PUBLIC_LOGINROUTE;

        try {
            const request: serverRequestConfig = {
                data: fallbackToen,
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                withCredentials: true,
                url: `${refreshRoute}/refresh`
            }
            const updateAccessToken = await axios(request);
            if (updateAccessToken.status === 400) {
                return NextResponse.redirect(new URL('/', req.url));
            }
        } catch (e: any) {
            return e
        }
    }



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

