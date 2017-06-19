declare class PromiseWorker {
  constructor(worker: Worker);

  postMessage<T>(message: any, transfer?: any[] | undefined): Promise<T>;
}

declare module "promise-worker" {
  export = PromiseWorker;
}

declare module "promise-worker/register" {
  function registerPromiseWorker(callback: (event: MessageEvent) => void): void;

  export = registerPromiseWorker;
}
