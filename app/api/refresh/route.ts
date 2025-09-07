
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken} from "../../helper/jwt";

export async function POST(req: NextRequest) {
    // Get cookie by name
    const myCookie = req.cookies.get("refreshToken"); // 👈 change "myToken" to your cookie name


    if (!myCookie) {
        return NextResponse.json(
            { message: "Cookie not found" },
            { status: 404 }
        );
    }
    const isRefreshTokenValid = await verifyRefreshToken(myCookie?.value)

    console.log(isRefreshTokenValid)

    return NextResponse.json(
        { cookieName: "myToken", value: myCookie.value },
        { status: 200 }
    );
}
