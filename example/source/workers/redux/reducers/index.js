import { combineReducers } from "redux";
import { apolloReducer } from "../../../shared/services/apollo";
import counterReducer from "./counter";

const rootReducer = combineReducers({
  counter: counterReducer,
  apollo: apolloReducer,
});

export default rootReducer;
