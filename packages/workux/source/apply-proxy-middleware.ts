import { Action, Middleware, compose } from "redux";
import { ProxyStore, ProxyStoreCreator, ProxyStoreEnhancer } from "./types";

export default function applyProxyMiddleware<S>(...middlewares: Middleware[]) {
  return (createProxyStore: ProxyStoreCreator) => (
    worker: Worker,
    preloadedState?: S,
    enhancer?: ProxyStoreEnhancer<S>
  ): ProxyStore<S> => {
    const store = createProxyStore(worker, preloadedState, enhancer);
    let dispatch = store.dispatch;
    let chain = [];

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action: Action) => dispatch(action),
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}
