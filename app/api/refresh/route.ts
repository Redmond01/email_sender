
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "../../helper/jwt";

export async function GET(req: NextRequest) {
    // Get cookie by name
    const myCookie = req.cookies.get("refreshToken"); // 👈 change "myToken" to your cookie name
    const redirect = req.nextUrl.searchParams.get("redirect") || "/"


    if (!myCookie) {
        return NextResponse.json(
            { message: "Cookie not found" },
            { status: 404 }
        );
    }
    
    const { message, status } = await verifyRefreshToken(myCookie['value'])
    const serverResponse = NextResponse.redirect(new URL(redirect, req.url))
    serverResponse.cookies.set('accessToken', message, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 2 })

    return serverResponse

}
