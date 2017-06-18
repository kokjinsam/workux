import { applyMiddleware, createStore } from "redux";
import apolloMiddleware from "../../shared/services/apollo";
import rootReducer from "./reducers";

export default function getStore() {
  const middlewares = [];
  const store = createStore(rootReducer, applyMiddleware(...middlewares));

  if (module.hot) {
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers").default;

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
