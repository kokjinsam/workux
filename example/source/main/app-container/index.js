import React from "react";
import { ApolloProvider } from "react-apollo";
import App from "./components/app";

export default class AppContainer extends React.Component {
  render() {
    const { reduxStore, apolloClient } = this.props;

    return (
      <ApolloProvider store={reduxStore} client={apolloClient}>
        <App />
      </ApolloProvider>
    )
  }
}