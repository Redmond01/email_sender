import { ApolloServer, } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
const data = [{ name: 'raymond', age: 26 }, { name: 'motunrayo', age: 12 }]



const persons = [
    { "id": 1, "name": "Alice Johnson" },
    { "id": 2, "name": "Bob Chen" },
    { "id": 3, "name": "Claire Rodriguez" }
]

const crafts = [
    { "id": 10, "personID": 1, "name": "Winter Crafts Collection" },
    { "id": 11, "personID": 2, "name": "Artisan Wood & Glass" },
    { "id": 12, "personID": 3, "name": "Boho Chic Creations" }
]
const items = [
    // Alice's items (Craft ID: 10)
    { "id": 101, "craftID": 10, "details": "Hand-knitted wool scarf in navy blue" },
    { "id": 102, "craftID": 10, "details": "Ceramic coffee mug with mountain glaze" },
    { "id": 103, "craftID": 10, "details": "Leather-bound journal with gold embossing" },

    // Bob's items (Craft ID: 11)
    { "id": 201, "craftID": 11, "details": "Wooden puzzle box with hidden compartments" },
    { "id": 202, "craftID": 11, "details": "Hand-blown glass vase with swirl design" },
    { "id": 203, "craftID": 11, "details": "Embroidered silk pillow with floral motif" },
    { "id": 204, "craftID": 11, "details": "Miniature ship model with working sails" },

    // Claire's items (Craft ID: 12)
    { "id": 301, "craftID": 12, "details": "Crocheted amigurumi dragon plushie" },
    { "id": 302, "craftID": 12, "details": "Hand-painted porcelain tea set" },
    { "id": 303, "craftID": 12, "details": "Macrame wall hanging with wooden beads" },
    { "id": 304, "craftID": 12, "details": "Recycled paper bead necklace" },
    { "id": 305, "craftID": 12, "details": "Hand-carved soapstone figurine" }
]




const test = `#graphql
    type Person {
        id: ID!
        name:String!
        collections:[Craft!]!
    }
    type Craft{
        personID:Int!
        name:String
        crafts:[Item]
    }
    type Item{
        id:ID!
        craftID:String!
        details:String!
    }
    

    type Query{
        individual(id:ID!):Person
    }

    type Mutation{
        person(name:String, id:Int):Person
    }
`
const resolver = {
    //mutation
    Mutation: {
        person: (_: {}, { name, id }: { name: string, id: string }) => {
            const updatePerson = { id: persons.length + 1, name: name, collections: [] };
            return updatePerson
        }
    },
    Person: {
        collections: ({id}:{id:number}) => {
           return crafts.filter(({id})=> id === id )
        }
    },


    //query
    Query: {
        individual: (_: {}, { id }: { id: string }) => {
            return persons.find((p) => p.id === parseInt(id))
        },
    },

    Person: {
        collections: ({ id }: { id: number, name: string, personID: number }) => {
            return crafts.filter(({ personID }) => personID === id);
        }
    },

    Craft: {
        crafts: ({ id }: { id: number, craftID: string }) => {
            return items.filter(({craftID}) => craftID === id)
        }
    }
}


const server = new ApolloServer({
    typeDefs: test, resolvers: resolver
})


const { url } = await startStandaloneServer(server);


console.log(`connection is on at ${url}`)


