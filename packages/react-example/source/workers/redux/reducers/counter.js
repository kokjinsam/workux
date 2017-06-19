import { handleActions } from "redux-actions";
import { INCREMENT, DECREMENT } from "../../../shared/action-types/counter";

const initialState = {
  count: 0,
};

const counterReducer = handleActions(
  {
    [INCREMENT]: (state, action) => ({
      ...state,
      count: state.count + 1,
    }),
    [DECREMENT]: (state, action) => ({
      ...state,
      count: state.count - 1,
    }),
  },
  initialState
);

export default counterReducer;
