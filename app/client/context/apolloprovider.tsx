"use client"
import { ApolloProvider } from '@apollo/client/react';
import { client } from '../lib/graphqlclient';
const ApoloProviderContext = ({ children }: { children: React.ReactNode }) => {
    return (
        <ApolloProvider client={client}>{children} </ApolloProvider>
    )
}
export default ApoloProviderContext
