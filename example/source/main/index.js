import React from "react";
import ReactDOM from "react-dom";
import { AppContainer as HotLoaderContainer } from "react-hot-loader";
import { createProxyStore } from "workux";
import ReduxWorker from "worker-loader!../workers/redux";
import { apolloClient } from "../shared/services/apollo";
import AppContainer from "./app-container";

const worker = new ReduxWorker();
const reduxProxyStore = createProxyStore(worker);

reduxProxyStore.ready(() => {
  const MOUNT_NODE_NAME = "root";
  const reactNode = document.getElementById(MOUNT_NODE_NAME);

  ReactDOM.render(
    <HotLoaderContainer>
      <AppContainer
        reduxStore={reduxProxyStore}
        apolloClient={apolloClient}
      />
    </HotLoaderContainer>,
    reactNode
  );

  if (module.hot) {
    module.hot.accept("./app-container", () => {
      // FIXME: use `import` keyword to import module instead
      // of require. Blocking because TS doesn't support ES6
      // dynamic import yet.
      // tslint:disable-next-line:no-require-imports
      const NextAppContainer = require("./app-container").default;

      ReactDOM.render(
        <HotLoaderContainer>
          <NextAppContainer
            reduxStore={reduxProxyStore}
            apolloClient={apolloClient}
          />
        </HotLoaderContainer>,
        reactNode
      );
    });
  }
});
