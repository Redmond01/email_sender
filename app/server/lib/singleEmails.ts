
import { prismadb } from './dbconnection';
import type { userRecipient, Response } from '../../typemodule';
import validator from 'validator';



export const singleEmail = async (recipientData: userRecipient) => {

    try {
        // Validate email format
        if (!validator.isEmail(recipientData.email)) {
            throw new Error('Invalid email format');
        }

        // Check for existing recipient with same email, company and industry
        const existingRecipient = await prismadb.recipient.findFirst({
            where: {
                email: recipientData.email,
                companyName: recipientData.companyName,
                industry: recipientData.industry
            }
        });

        if (existingRecipient) {
            // send back error message to api
            const response: Response = { inserted: 0, message: 'recipient credentials already exist in db', status: 401 }

            return response
        }

        // Save to database
        await prismadb.recipient.create({ data: recipientData });

        const response: Response = { inserted: 1, message: 'user added to the db', status: 200 }
        return response

    } catch (e: any) {
        const response: Response = { message: 'error occured', status: 500 }
        return response
    }
};
