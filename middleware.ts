// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessTokens } from './app/helper/jwt';
import axios from 'axios';
import type { serverRequestConfig } from './app/typemodule';


export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    // 🛑 Routes to protect (you can customize)
    const protectedRoutes = ['/admin', '/form'];

    // 🌍 Public routes (skip protection)
    const publicRoutes = ['/'];


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
        const refreshRoute = process.env.NEXT_PUBLIC_LOGINROUTE;

        try {
            const request: serverRequestConfig = {
                data: fallbackToken,
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                withCredentials: true,
                url: `${refreshRoute}/refresh`
            }
            const updateAccessToken = await axios(request);
            console.log('request made')
            if (updateAccessToken.status === 400) {
                return NextResponse.redirect(new URL('/', req.url));
            }
            return NextResponse.next()
        } catch (e: any) {
            console.log(e.message)
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    console.log('first')

    // final fallback
    return NextResponse.redirect(new URL("/", req.url));

}

// Configure which paths this middleware applies to
export const config = {
    matcher: ['/form/:path*', '/admin/:path*'],
};

