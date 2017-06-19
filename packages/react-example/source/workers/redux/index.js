import { createWorkerStore } from "workux";
import getStore from "./get-store";

const store = getStore();

createWorkerStore(store);
