import { prismadb } from "./dbconnection";

export const resolver = {
    Query: {
        getRecipientLength: async () => {
            const ds = await prismadb.recipient.count()
            return { AllRecipientLength: ds }
        }
    }
}