
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "../../helper/jwt";

export async function POST(req: NextRequest) {
    // Get cookie by name
    const myCookie = req.cookies.get("refreshToken"); // 👈 change "myToken" to your cookie name
    const {token} = await req.json()


    if (!myCookie) {
        return NextResponse.json(
            { message: "Cookie not found" },
            { status: 404 }
        );
    }
    const { message, status } = await verifyRefreshToken((myCookie['value']|| token))
    const serverResponse = NextResponse.json({ message: 'accessToken regenerated' }, { status: status })
    serverResponse.cookies.set('accessToken', message, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 2 })
    console.log(myCookie, message, req.body);

    return serverResponse
}
