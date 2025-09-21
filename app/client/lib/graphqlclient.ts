import { ApolloClient, InMemoryCache, HttpLink} from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({uri:'http://localhost:5000/api/graphql'}), // same port, Next.js handles it
  cache: new InMemoryCache(),

});
