import { NavLink } from "react-router-dom";
import {
  useSetup,
  writable,
  combine,
  useSubscription
} from "../react-scc";

// const useSetup = createOnce()

const counter = writable(0);
const counter1 = writable(0);

const Home1 = () => {
  useSetup(() => {
    console.log("setup 1");
  });

  useSubscription(combine([counter, counter1]))

  console.log("rendering");
  return (
    <>
      Counter: {counter.get()}
      <button onClick={() => counter.update((count) => count - 1)}>-1</button>
      <button onClick={() => counter.update((count) => count + 1)}>+1</button>
      Counter1: {counter1.get()}
      <button onClick={() => counter1.update((count) => count - 1)}>-1</button>
      <button onClick={() => counter1.update((count) => count + 1)}>+1</button>
      <NavLink to="/about">About</NavLink>
    </>
  );
};

// const Home = createSCC({
//   counter: 0,
// })(({ counter }) => {
//   return (
//     <>
//       Counter: {counter}
//       <NavLink to="/about">About</NavLink>
//     </>
//   );
// })

export default Home1;
