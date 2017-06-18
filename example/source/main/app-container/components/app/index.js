import gql from "graphql-tag";
import React from "react";
import { graphql } from "react-apollo";
import { connect } from "react-redux";
import { increment, decrement } from "../../../../shared/actions/counter";

const App = ({
  count,
  incrementCount,
  decrementCount,
  data: { loading, pokemon },
}) =>
  <div>
    <h1>Count {count}</h1>
    <button onClick={incrementCount}>increment</button>
    <button onClick={decrementCount}>decrement</button>
    <h1>Pokemon</h1>
    {loading && <span>loading</span>}
    {pokemon &&
      <ul>
        <li>name: {pokemon.name}</li>
        <li>id: {pokemon.id}</li>
        <li>attack: {pokemon.attack}</li>
        <li>catch rate: {pokemon.catch_rate}</li>
      </ul>}
  </div>;

const mapStateToProps = state => ({
  count: state.counter.count,
});

const mapDispatchToProps = dispatch => ({
  incrementCount: () => {
    dispatch(increment());
  },
  decrementCount: () => {
    dispatch(decrement());
  },
});

const pokemon = gql`
  query {
    pokemon(number: 10) {
      id
      attack
      catch_rate
      name
    }
  }
`;

export default graphql(pokemon)(
  connect(mapStateToProps, mapDispatchToProps)(App)
);
