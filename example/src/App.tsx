import createSCC, { ReactiveState } from 'react-scc';

interface AppProps {}

interface ControllerValue {
  increment: () => void;
  decrement: () => void;
  handleRef: (ref: any) => void;
  reset: () => void;
}

const globalState = new ReactiveState(0);

const App = createSCC<AppProps, number, ControllerValue>({
  state: 0,
  globalState,
  controller: ({ state }) => {

    return {
      increment: () => {
        globalState.update(count => count + 1);
        state.update(st => globalState.currentValue * 2)
      },
      decrement: () => {
        globalState.update(count => count - 1);
        state.update(st => globalState.currentValue * 2)
      },
      handleRef: (ref) => {
        console.log({ ref });
      },
      reset: () => {
        globalState.set(0);
        state.set(0);
      }
    };
  },
  component: ({ ctrlValue, state }) => {
    console.log('re-render');
    return (
      <div className="app" ref={ctrlValue.handleRef}>
        <div className="App-header">
          <div>
            Counter: {globalState.currentValue}
          </div>
          <p>
            Counter<sup>2</sup>: {state}
          </p>
          <div>
            <button onClick={ctrlValue.increment}>+</button>
            <button onClick={ctrlValue.decrement}>-</button>
            <button onClick={ctrlValue.reset}>Reset</button>
          </div>
        </div>
      </div>
    )
  }
})

export default App;
