import React from "react";
import { connect } from "react-redux";
import { increment, decrement } from "../../../../shared/actions/counter";

const App = ({
  count,
  incrementCount,
  decrementCount,
}) => (
  <div>
    <h1>Count {count}</h1>
    <button onClick={incrementCount}>increment</button>
    <button onClick={decrementCount}>decrement</button>
  </div>
);

const mapStateToProps = (state) => ({
  count: state.counter.count,
});

const mapDispatchToProps = (dispatch) => ({
  incrementCount: () => {
    dispatch(increment());
  },
  decrementCount: () => {
    dispatch(decrement());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
