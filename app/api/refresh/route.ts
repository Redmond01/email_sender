
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "../../helper/jwt";

export async function POST(req: NextRequest) {
    // Get cookie by name
    const myCookie = req.cookies.get("refreshToken"); // 👈 change "myToken" to your cookie name


    if (!myCookie) {
        return NextResponse.json(
            { message: "Cookie not found" },
            { status: 404 }
        );
    }
    const isRefreshTokenValid = await verifyRefreshToken(myCookie['value'])
    // const ServerResponse = NextResponse.json({ message: 'accessToken regenerated', user: isRefreshTokenValid.sub }, { status: 200 })
    // serverResponse.cookies.set('accessToken', auth.data?.accestoken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 2 })
    // serverResponse.cookies.set('refreshToken', auth.data?.refreshtoken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })

    console.log(isRefreshTokenValid);
    
    return NextResponse.json(
        { cookieName: "myToken", value: myCookie.value },
        { status: 200 }
    );
}
