
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
        // const dataReceived = await req.json();
        // const {
        //     name,
        //     email,
        //     companyName,
        //     noOfEmailSent,
        //     userStatus,
        //     industry,
        //     validateEmail,
        // } = dataReceived

        // const authRecipient = await createRecipient({
        //     name: name,
        //     email: email,
        //     companyName: companyName,
        //     noOfEmailSent: 0,
        //     userStatus: true,
        //     industry: industry,
        //     emailValid: false
        // })
        // const modifyDataReceived = modifyStringKeyToValue(data)
        
        // const updateArray = modifyDataReceived.map((each) => {
        //     return { ...each, noOfEmailSent: 0, userStatus: true, emailValid: true ,isFirstMail:false}
        // })
        console.log(data)

        // await multipleEmail(updateArray)
        return NextResponse.json({ message: 'hello' })
    } catch (e) {
        return NextResponse.json({ message: e }, { status: 500 })
    }
}