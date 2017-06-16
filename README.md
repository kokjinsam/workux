# Workux

## Disclaimer

This package still has lots of rough edges (specifically, middlewares/actions that require History APIs, etc.), please use it with caution.

## Overview

Separate app business logic from the main thread, leaving only the UI and animation stuffs. Here's a general idea how apps would work with `workux`:

For local state:

1. UI component dispatches action to proxy store.
2. Proxy store passes action to web worker.
3. Web worker dispatches action to Redux store and sends the updated state back to proxy store.
4. Proxy store updates UI component.

For remote state:

1. UI component dispatches action to proxy store.
2. Proxy store passes action to web worker.
3. Web worker dispatches action to Redux store.
4. Redux saga captures and sends data to server.
5. Redux saga receives data from server and updates Redux store.
6. Web worker watches for Redux store changes and sends updates to proxy store.
7. Proxy store updates UI component.

## Installation

Please note that Redux and Lodash are peer dependencies. If you're using Webpack, you will need worker-loader as well.

```bash
$ yarn add workux redux lodash worker-loader
```

## API Reference

Exports:

* `applyProxyMiddleware`
* `createProxyStore`
* `createWorkerStore`
* Typescript [types](./source/types.ts)

Typescript user? You're in luck! This package is written in Typescript!

---

### `applyProxyMiddleware`

Similar to Redux's `applyMiddleware` but for middlewares that need access to APIs that cannot be accessed from web workers. For example, `react-router-redux`.

#### Usage

```js
// source/main/index.js

import { createRouterMiddleware } from "@regroup/redux";
import createBrowserHistory from "history/createBrowserHistory";
import { applyProxyMiddleware } from "workux";

const browserHistory = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(browserHistory);

const middleware = [ routerMiddleware ];

// proxyEnhancer is then passed on to `createProxyStore`
const proxyEnhancer = applyProxyMiddleware(...middleware);
```

### `createProxyStore`

Similar to Redux store. This proxy store listens Redux worker store for updates and dispatches actions. 

#### Usage

```js
// source/main/index.js

import ReduxWorker from "worker-loader!../workers/redux";

const worker = new ReduxWorker();

// proxyEnhancer comes from `applyProxyMiddleware`
const reduxProxyStore = createProxyStore(worker, proxyEnhancer);

reduxProxyStore.ready(() => {
  // do whatever you need to do
  // like render React app, etc.
});
```

### `createWorkerStore`

Listens to actual store changes and update proxy store accordingly. It also listens to action dispatches from proxy store and dispatches actions to actual store.

#### Usage

```js
// source/workers/redux/index.js

import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import { createWorkerStore } from "workux";
import rootReducer from "./reducers";

const loggerMiddleware = createLogger();
const middlewares = [ loggerMiddleware ];

// up to this point, it's all normal Redux store.
const store = createStore(rootReducer, applyMiddleware(...middlewares));

createWorkerStore(store);
```

## License

This package is [MIT licensed](./LICENSE).

## References

* [react-chrome-redux](https://github.com/tshaddix/react-chrome-redux)
* [redux-shared-worker](https://github.com/burakcan/redux-shared-worker)
* [redux-web-worker](https://github.com/deebloo/redux-web-worker)
* [redux-worker-middleware](https://github.com/keyanzhang/redux-worker-middleware)
