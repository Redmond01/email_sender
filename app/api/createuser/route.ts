
import { NextResponse } from 'next/server';

import { prismadb } from '../../server/lib/dbconnection';
import { multipleEmail } from '../../server/lib/multipleemails';
import { modifyStringKeyToValue } from '../../helper/modifystringkeytovalue';



export const GET = async (req: Request) => {
    const findList = await prismadb.recipient.findMany();
    console.log(findList)
    return NextResponse.json({ msg: "hello" })
}

export const POST = async (req: Request) => {
    const { data } = await req.json()
    try {

        const modifyDataReceived = modifyStringKeyToValue(data)
        
        console.log(modifyDataReceived)

        await multipleEmail(modifyDataReceived)
        return NextResponse.json({ message: 'hello' })
    } catch (e) {
        return NextResponse.json({ message: e }, { status: 500 })
    }
}