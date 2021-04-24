import createSCC from 'react-scc';

interface AppProps {}

interface ControllerValue {
  increment: () => void;
  decrement: () => void;
  handleRef: (ref: any) => void;
  reset: () => void;
}

const App = createSCC<AppProps, number, ControllerValue>({
  state: 0,
  controller: ({ state }) => {

    return {
      increment: () => {
        state.update(count => count + 1);
      },
      decrement: () => {
        state.update(count => count - 1);
      },
      handleRef: (ref) => {
        // eslint-disable-next-line no-console
        console.log({ ref });
      },
      reset: () => {
        state.set(0);
      }
    };
  },
  component: ({ componentState, increment, decrement, handleRef, reset }) => {
    return (
      <div className="app" ref={handleRef}>
        <div className="App-header">
          Counter: {componentState}
          <div>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>
      </div>
    )
  }
})

export default App;
