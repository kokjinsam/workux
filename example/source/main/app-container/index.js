import React from "react";
import { ApolloProvider } from "react-apollo";
import App from "./components/app";

export default class AppContainer extends React.Component {
  state = {
    ready: false,
  };

  componentDidMount() {
    const { reduxStore } = this.props;

    // need to wait until web worker is ready before
    // starting the app. If not, you will get `undefined`
    // when retrieving state.
    reduxStore.ready(() => {
      this.setState({
        ready: true,
      });
    });
  }

  render() {
    const { reduxStore, apolloClient } = this.props;
    const { ready } = this.state;

    if (ready) {
      return (
        <ApolloProvider store={reduxStore} client={apolloClient}>
          <App />
        </ApolloProvider>
      );
    }

    return <h1>loading....</h1>;
  }
}
