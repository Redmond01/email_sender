import {ApolloServer,} from '@apollo/server'

const test = `
    type Name={
    name:'raymond'
    }
`

const graphQuery = `
    type Query={
       name: ${test}
    }

`

