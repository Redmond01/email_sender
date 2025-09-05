import { NextResponse } from "next/server";
import { signup } from '../../server/tools/auth/signup'



export async function POST(req: Request) {
    try {
        const { username, password, uniqueCode } = await req.json();

        const createNewUser = await signup(username, password, uniqueCode);

        return NextResponse.json({ message: createNewUser }, { status: createNewUser.status })

    } catch (e: any) {
        return NextResponse.json({message:'server error', data:e.message}, {status:500})
    }
}