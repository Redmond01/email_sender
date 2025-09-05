import { PrismaClient } from '@/app/generated/prisma/client.js'
import { writeFile as writeTemporaryJson } from 'fs/promises'
import {randomizeEmailIndex} from '../../helper/randomindex'

export const fetchRecipients = async () => {
  const prismadb = new PrismaClient();

  try {
    // Query recipients with noOfEmailSent ≠ 8
    const recipients = await prismadb.recipient.findMany({
      where: {
      noOfEmailSent: {
        lte: 8,

      }
      }
    })


    //updating number of times email is called
    const updateEmailProps = recipients.map((data) => {
      return { ...data, noOfEmailSent: data.noOfEmailSent += 1 }
    })

    //update db with the latest update of object
    for (const each of updateEmailProps) {
      await prismadb.recipient.update({
        where: { id: each.id },
        data: each,
      });
    }


    // Write data to JSON file
    await writeTemporaryJson('../temp/email.json', JSON.stringify(randomizeEmailIndex(updateEmailProps), null, 2))

    return recipients
  } catch (error) {
    console.error('Database fetch error:', error)
    throw error
  } finally {
    await prismadb.$disconnect()
  }
}
