
import { NextResponse } from 'next/server';
import { authUser } from '../../server/tools/auth/login';


export const POST = async (req: Request) => {
    try {
        const { username, password } = await req.json();

        const auth = await authUser(username, String(password))

        const serverResponse = NextResponse.json({ message: auth.message }, { status: auth.status })
        serverResponse.cookies.set('accessToken', auth.data?.accestoken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 2 })
        serverResponse.cookies.set('refreshToken', auth.data?.refreshtoken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })

        return serverResponse
    } catch (e: any) {
        return NextResponse.json({ msg: e.message }, { status: 500 })
    }
} 