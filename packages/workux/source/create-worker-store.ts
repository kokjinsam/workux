import { Store } from "redux";
import { RECEIVE_MESSAGE, UPDATE_STATE } from "./types";

export default function createStore<S>(store: Store<S>): Store<S> {
  if (store === undefined) {
    throw new Error("A Redux store is needed to create a worker store.");
  }

  if (
    typeof store.subscribe !== "function" ||
    typeof store.dispatch !== "function"
  ) {
    throw new Error(
      "A Redux store needs to have `subscribe` and `dispatch` methods."
    );
  }

  store.subscribe(() => {
    const currentState = store.getState();

    postMessage({
      type: UPDATE_STATE,
      payload: {
        state: currentState,
      },
    });
  });

  addEventListener(RECEIVE_MESSAGE, (event: MessageEvent) => {
    const action = event.data;

    store.dispatch(action);
  });

  return store;
}
