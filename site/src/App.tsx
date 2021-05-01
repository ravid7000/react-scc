import { createSCC } from 'react-scc';

import globalState, { createTimeStamp } from './store';

// components
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import Transition from './animate/transition';

interface ControllerValue {
  addTodo: (title: string) => void;
  toggleTodoItem: (id: number) => void;
  deleteTodo: (id: number) => void;
}


const App = createSCC<unknown, undefined, ControllerValue>({
  state: undefined,
  subscribe: globalState,
  displayName: 'App',
  controller: () => {
    return {
      addTodo: (title) => {
        globalState.update(state => [{ done: false, title, id: Date.now(), timestamp: createTimeStamp() }, ...state]);
      },
      toggleTodoItem: (id) => {
        globalState.update(state => state.map((item) => {
          if (item.id === id) {
            item.done = !item.done
          }
          return item;
        }))
      },
      deleteTodo: (id) => {
        globalState.update(state => state.filter(todo => todo.id !== id))
      },
    };
  },
  component: ({ ctrlValue }) => {
    console.log('app rendering');
    return (
      <div className="App">
        <div className="app-title">TODO</div>
        <div className="app-wrapper">
          <TodoForm onSubmit={ctrlValue.addTodo} />
          <div className="app-content">
            {globalState.currentValue.map((item) => (
              <Transition duration={200} in key={item.id}>
                <TodoItem
                  key={item.id}
                  done={item.done}
                  title={item.title}
                  timestamp={item.timestamp}
                  onClick={() => ctrlValue.toggleTodoItem(item.id)}
                  onDelete={() => ctrlValue.deleteTodo(item.id)}
                />
              </Transition>
            ))}
          </div>
          <div className="total-count">
            <div>All: {globalState.total}</div>
            <div>Pending: {globalState.pending}</div>
            <div>Finished: {globalState.doneTodo}</div>
          </div>
        </div>
      </div>
    )
  }
})

export default App;
