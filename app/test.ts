import { ApolloServer, } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
const data = [{ name: 'raymond', age: 26 },{ name: 'motunrayo', age: 12 }]

const test = `#graphql
    type Name {
        name:String
        age:Int
    }

    type Query{
        name:Name
        age:[Name]
    }
`

const resolver = {
    Query: {
        name: () => {
          return data[0]
        },
        age:() => {
          return data
        }
    }
}

const server = new ApolloServer({
    typeDefs: test, resolvers: resolver
})


const { url } = await startStandaloneServer(server);


console.log(`connection is on at ${url}`)