import { Dispatch, Unsubscribe } from "redux";

export const INIT = "@@WORKUX/INIT";
export const UPDATE_STATE = "@@WORKUX/STATE_UPDATED";
export const RECEIVE_MESSAGE = "message";

export type Listener = () => void;

export interface ProxyStore<S> {
  dispatch: Dispatch<S>;
  getState(): S;
  subscribe(listener: Listener): Unsubscribe;
  destroy(): void;
  start(): void;
  ready(callback: () => void): void;
}

export interface ProxyStoreCreator {
  <S>(worker: Worker, enhancer?: ProxyStoreEnhancer<S>): ProxyStore<S>;
  <S>(worker: Worker, preloadedState?: S, enhancer?: ProxyStoreEnhancer<
    S
  >): ProxyStore<S>;
}

export type ProxyStoreEnhancerStoreCreator<S> = (
  worker: Worker,
  preloadedState?: S
) => ProxyStore<S>;

export type ProxyStoreEnhancer<S> = (
  next: ProxyStoreEnhancerStoreCreator<S>
) => ProxyStoreEnhancerStoreCreator<S>;
