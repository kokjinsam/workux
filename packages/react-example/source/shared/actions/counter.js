import { createAction } from "redux-actions";
import { INCREMENT, DECREMENT } from "../action-types/counter";

export const increment = createAction(INCREMENT);
export const decrement = createAction(DECREMENT);
