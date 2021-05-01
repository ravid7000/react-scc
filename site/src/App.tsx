import { createSCC } from 'react-scc';

import globalState from './store';

// components
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

interface ControllerValue {
  addTodo: (title: string) => void;
  toggleTodoItem: (id: number) => void;
  deleteTodo: (id: number) => void;
}


const App = createSCC<unknown, ControllerValue>({
  state: globalState,
  displayName: 'App',
  controller: () => {
    return {
      addTodo: (title) => {
        globalState.update(state => [{ done: false, title, id: Date.now() }, ...state]);
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
    return (
      <div className="App">
        <div className="app-wrapper">
          <TodoForm onSubmit={ctrlValue.addTodo} />
          {globalState.currentValue.map((item) => (
            <TodoItem
            key={item.id}
            done={item.done}
            title={item.title}
            onClick={() => ctrlValue.toggleTodoItem(item.id)}
            onDelete={() => ctrlValue.deleteTodo(item.id)}
            />
          ))}
          <p className="total-count">All: {globalState.currentValue.length}, Finished: {globalState.doneTodo}</p>
        </div>
      </div>
    )
  }
})

export default App;
