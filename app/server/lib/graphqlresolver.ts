import { prismadb } from "./dbconnection";

export const resolver = {
    Query: {
        getRecipientLength: async () => {
            const ds = await prismadb.user.count()
            return { AllRecipientLength: ds }
        }
    }
}