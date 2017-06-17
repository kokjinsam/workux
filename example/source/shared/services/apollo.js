import { ApolloClient, createNetworkInterface } from "apollo-client";

const networkInterface = createNetworkInterface({
  uri: "https://pokeapi-graphiql.herokuapp.com/",
});

const client = new ApolloClient({
  networkInterface,
});

const middleware = client.middleware();
const reducer = client.reducer();

export {
  client as apolloClient,
  middleware as apolloMiddleware,
  reducer as apolloReducer,
}