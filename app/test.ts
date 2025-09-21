import { ApolloServer, } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { dbType } from './server/lib/graphqltypes.ts';
import { prismadb } from './server/lib/dbconnection.ts';



const resolver = {
    Query: {
        getRecipientLength: async () => {
          const ds =  await prismadb.user.count()
          return {AllRecipientLength:ds}
        }
    }
}


const server = new ApolloServer({
    typeDefs: dbType, resolvers: resolver
})


const { url } = await startStandaloneServer(server);


console.log(`connection is on at ${url}`)


