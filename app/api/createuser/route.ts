
import { NextResponse } from 'next/server';

import { createRecipient } from '@/app/tools/email/main'

export const POST = async (req: Request) => {
    try {
        const dataReceived = await req.json();
        const {
            name,
            email,
            companyName,
            noOfEmailSent,
            userStatus,
            industry,
            validateEmail,
        } = dataReceived

        const authRecipient = await createRecipient({
            name: name,
            email: email,
            companyName: companyName,
            noOfEmailSent: 0,
            userStatus: true,
            industry: industry,
            emailValid:false
        })
        return NextResponse.json({ message: authRecipient.message }, { status: authRecipient.status })
    } catch (e) {
        return NextResponse.json({message:e},{status:500})
    }
}