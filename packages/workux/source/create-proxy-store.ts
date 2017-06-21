import { isPlainObject } from "lodash";
import PromiseWorker = require("promise-worker"); // tslint:disable-next-line: no-require-imports
import { Action } from "redux";
import {
  INIT,
  Listener,
  ProxyStore,
  ProxyStoreEnhancer,
  RECEIVE_MESSAGE,
  UPDATE_STATE,
} from "./types";

export default function createProxyStore<S>(
  worker: Worker,
  preloadedState?: S | ProxyStoreEnhancer<S>,
  enhancer?: ProxyStoreEnhancer<S>
): ProxyStore<S> {
  if (typeof preloadedState === "function" && enhancer === undefined) {
    enhancer = preloadedState; // tslint:disable-line:no-param-reassign
    preloadedState = undefined; // tslint:disable-line:no-param-reassign
  }

  if (enhancer !== undefined) {
    if (typeof enhancer !== "function") {
      throw new Error("Expected the enhancer to be a function.");
    }

    return enhancer(createProxyStore)(worker, preloadedState as S);
  }

  let currentState = preloadedState as S;
  let listeners: Listener[] = [];
  let isDispatching = false;
  let readyResolve: Function;
  let readyResolved = false;

  // tslint:disable-next-line: promise-must-complete
  const readyPromise = new Promise(resolve => (readyResolve = resolve));
  const promiseWorker = new PromiseWorker(worker);

  function getState() {
    return currentState;
  }

  function subscribe(listener: Listener) {
    if (typeof listener !== "function") {
      throw new Error("Expected listener to be a function.");
    }

    listeners.push(listener);

    function unsubscribe() {
      listeners = listeners.filter(l => l !== listener);
    }

    return unsubscribe;
  }

  async function dispatch(action: Action) {
    if (!isPlainObject(action)) {
      throw new Error(
        "Actions must be plain objects. " +
          "Use custom middleware for async actions."
      );
    }

    if (typeof action.type === undefined) {
      throw new Error(
        'Actions may not have an undefined "type" property.' +
          "Have you misspelled a constant?"
      );
    }

    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }

    isDispatching = true;

    return promiseWorker.postMessage<S>(action).then(updatedState => {
      isDispatching = false;

      // callbacks....callbacks....
      // we don't want to wait for worker callback
      // to update proxy store to avoid mismatch
      _replaceState(updatedState);

      return action;
    });
  }

  function destroy() {
    worker.removeEventListener(
      RECEIVE_MESSAGE,
      _handleReceiveMessageFromWorker
    );

    worker.terminate();
  }

  function start() {
    worker.addEventListener(RECEIVE_MESSAGE, _handleReceiveMessageFromWorker);

    // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.
    dispatch({ type: INIT });
  }

  function ready(cb?: () => void) {
    if (cb !== undefined) {
      return readyPromise.then(cb);
    }

    return readyPromise;
  }

  function _replaceState(nextState: S) {
    listeners.forEach(listener => listener());

    currentState = nextState;
  }

  function _handleReceiveMessageFromWorker(event: MessageEvent) {
    const action = event.data;
    if (action.type === UPDATE_STATE) {
      // A safety precaution to make sure
      // that the next dispatched action is not blocked.
      // Since we will be receiving new state,
      // we can assume that it's safe to dispatch
      // next action.
      isDispatching = false;

      const nextState = action.payload.state;

      //! FIXME: UPDATE_STATE will be trigged when
      //! redux store is updated through `dispatch`
      //! or a side-effect like redux-saga.
      //! As noted above, `dispatch` already `_replaceState`
      //! after it dispatches an action. So here, we're
      //! `_replaceState`-ing again after a dispatch.
      _replaceState(nextState);

      if (!readyResolved) {
        readyResolved = true;
        readyResolve();
      }
    }
  }

  start();

  return { getState, subscribe, dispatch, destroy, start, ready };
}
