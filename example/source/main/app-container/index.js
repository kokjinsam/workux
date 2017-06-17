import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import App from "./components/app";

export default class AppContainer extends React.Component {
  render() {
    const { reduxStore } = this.props;

    return (
      <ReduxProvider store={reduxStore}>
        <App />
      </ReduxProvider>
    )
  }
}