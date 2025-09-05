import { PrismaClient } from '@/app/generated/prisma/client.js';
import { userRecipient, Response } from '@/app/tools/email/main';
import validator from 'validator';



export async function multipleEmail(recipients: userRecipient[]) {

  const prismadb = new PrismaClient();

  try {

    // First check existing recipients in DB to avoid duplicates
    const existingRecipients = await prismadb.recipient.findMany({
      where: {
        OR: recipients.map(recipient => ({
          AND: [
            { email: recipient.email },
            { companyName: recipient.companyName },
            { industry: recipient.industry }
          ]
        }))
      },
      select: {
        email: true,
        companyName: true,
        industry: true
      }
    });

    // Filter out existing entries, invalid emails and validate email format
    const filteredData = recipients
      .filter(recipient => {
        const recipientExists = existingRecipients.some(existing =>
          existing.email === recipient.email &&
          existing.companyName === recipient.companyName &&
          existing.industry === recipient.industry
        );
        const isValidEmail = validator.isEmail(recipient.email);

        return !recipientExists && isValidEmail;
      })
      .map(({ id, ...rest }) => rest);



    // Insert filtered data into database within transaction
    const result = await prismadb.recipient.createMany({
      data: filteredData,
      // skipDuplicates: true
    });
    const response: Response = { inserted: result.count, message: `${result.count} recipients added to db`, status: 200, skipped: recipients.length - filteredData.length }

    return response


  } catch (error: any) {
    const response: Response = { message: 'error occured', status: 500 }
    return response
  } finally {
    await prismadb.$disconnect()
  }
}
