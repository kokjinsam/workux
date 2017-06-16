// tslint:disable-next-line: no-require-imports
import registerPromiseWorker = require("promise-worker/register");
import { Store } from "redux";
import { UPDATE_STATE } from "./types";

export default function createStore<S>(store: Store<S>): Store<S> {
  store.subscribe(() => {
    const currentState = store.getState();

    postMessage({
      type: UPDATE_STATE,
      payload: {
        state: currentState,
      },
    });
  });

  registerPromiseWorker((event: MessageEvent) => {
    const action = event;

    store.dispatch(action);

    // return store state so that proxy can
    // update right after the dispatch
    return store.getState();
  });

  return store;
}
