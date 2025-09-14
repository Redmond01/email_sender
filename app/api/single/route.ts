
import { prismadb } from '../../server/lib/dbconnection';
import { NextResponse } from "next/server";
import { singleEmail } from "../../server/lib/singleEmails";
import type { ServerResponse } from "../../typemodule";
import { v4 } from 'uuid';

export const GET = async (req: Request) => {
    const findList = await prismadb.recipient.deleteMany();
    console.log(findList)
    return NextResponse.json({ msg: "hello" })
}



export const POST = async (req: Request) => {

    const { data } = await req.json()

    try {
        const { firstname: name, email, companyName, industry } = data

        const credentials = { userStatus: true, emailValid: true, isFirstMail: false, noOfEmailSent: 0, id: v4() };

        const ds = { ...credentials, name, email, companyName, industry }

        const { message, status } = await singleEmail(ds)

        return NextResponse.json({ message: message }, { status: status })
    } catch (e: any) {
        const response: ServerResponse = { message: 'server failed', status: 500 }
        return NextResponse.json({ response })
    }
}