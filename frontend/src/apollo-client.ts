import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql", // ✅ バックエンドの GraphQL API エンドポイント
  cache: new InMemoryCache(),
});

export { client, gql };
