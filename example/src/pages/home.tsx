import { NavLink } from 'react-router-dom';
import { useSetup } from 'react-scc/dist/hooks/use-setup';

const Home1 = () => {
  useSetup(() => {
    console.log('mounted')
  })

  return (
    <>
      Counter
      <NavLink to="/about">About</NavLink>
    </>
  );
};

// const Home = createSCC({
//   state: 0,
// })(({ state }) => {
//   return (
//     <>
//       Counter: {state}
//       <NavLink to="/about">About</NavLink>
//     </>
//   );
// })

export default Home1;
