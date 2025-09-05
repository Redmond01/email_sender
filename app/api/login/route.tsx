
import { NextResponse } from 'next/server';
import { authUser } from '../../server/tools/auth/login';
import { cookies } from 'next/headers';
import type { getHashes } from 'crypto';

export const POST = async (req: Request) => {
    try {
        const { username, password } = await req.json();

        // return NextResponse.json({username,password})

        const auth = await authUser(username, String(password))

        const serverResponse = NextResponse.json({ message: auth }, { status: auth.status })
        serverResponse.cookies.set('accesToken', auth.data?.accestoken, { httpOnly: true, sameSite: true, maxAge: 60 * 60 * 2 })
        serverResponse.cookies.set('refreshToken', auth.data?.refreshtoken, { httpOnly: true, sameSite: true, maxAge: 60 * 60 * 24 * 7 })

        return serverResponse
    } catch (e: any) {
        return NextResponse.json({ msg: e.message }, { status: 500 })
     