import { NavLink } from "react-router-dom";
import { createSCC, Controller, FC } from "../react-scc";

type StateType = number

type ControllerType = {
  increment: () => void;
  decrement: () => void;
}

const Component: FC<unknown, StateType, ControllerType> = ({ state, ctrlValue }) => {
  return (
    <>
      Counter: {state}
      <button onClick={ctrlValue?.increment}>+1</button>
      <button onClick={ctrlValue?.decrement}>-1</button>
      <NavLink to="/about">About</NavLink>
    </>
  );
}

const controller: Controller<unknown, StateType, ControllerType> = ({ state, onMount }) => {
  onMount(() => {
    console.log('mounted')
  })

  return {
    increment: () => {
      state.update(count => count + 1);
    },
    decrement: () => {
      state.update(count => count - 1);
    }
  }
}

const Home = createSCC({
  state: 0,
  controller,
})(Component)

export default Home;
