import {startServerAndCreateNextHandler} from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { dbType } from "../../server/lib/graphqltypes";
import { resolver } from "../../server/lib/graphqlresolver";


const server = new ApolloServer({typeDefs:dbType, resolvers:resolver})

export const handler = startServerAndCreateNextHandler(server);

export {handler as GET, handler as POST}

