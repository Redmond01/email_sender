import { PrismaClient } from '@/app/generated/prisma/client.js';
// import { userRecipient, Response } from '@/app/typemodule';
import validator from 'validator'


export interface userRecipient {
    id?: number,
    name: string,
    email: string,
    companyName: string,
    noOfEmailSent: number
    userStatus: boolean,
    industry: string,
    emailValid: boolean
}

export type Response = {
    data?: {} | string,
    message: string,
    status: 200 | 400 | 500,
    inserted?: number,
    skipped?: number
}

export type  SmtpSchema={
    user:string,
    password:string
}


const validateEmail = (email: string): boolean => {
    return validator.isEmail(email)
}

export const createRecipient = async (data: userRecipient) => {
    const prismadb = new PrismaClient();

    const isEmailTrue = true
    const emailValidation = validateEmail(data.email)

    if (emailValidation !== isEmailTrue) {
        const response: Response = { message: 'email not valid!', status: 400 };
        return response;
    };

    const createNewEmailRecipient = await prismadb.recipient.create({
        data: {
            name: data.name,
            emailValid: validateEmail(data.email),
            email: data.email,
            companyName: data.companyName,
            industry: data.industry,
            noOfEmailSent: data.noOfEmailSent,
            userStatus: data.userStatus,
        }
    });

    if (createNewEmailRecipient) {
        const response: Response = { message: 'email record received!', status: 200 };
        return response;
    } else {
        const response: Response = { message: 'data was not saved!', status: 400 };
        return response;
    };
}