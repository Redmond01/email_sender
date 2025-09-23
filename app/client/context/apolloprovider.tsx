"use client"
import { ApolloProvider } from '@apollo/client/react';
import { myNewApoloClient } from '../lib/graphqlclient';

const ApoloProviderContext = ({ children }: { children: React.ReactNode }) => {
    
    return (
        <ApolloProvider client={myNewApoloClient}>{children} </ApolloProvider>
    )
}

export default ApoloProviderContext
