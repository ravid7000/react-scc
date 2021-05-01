import { WritableState } from 'react-scc'

const key = 'todoStore';

type TodoStore = { done: boolean, title: string, id: number }[]

class ComplexState extends WritableState<TodoStore> {
  get doneTodo() {
    return this.currentValue.filter(todo => todo.done).length
  }

  get pending() {
    return this.currentValue.filter(todo => !todo.done).length
  }

  get total() {
    return this.currentValue.length
  }
}

// persist store value in localStorage
function createPersistedStore() {
  let initialState: TodoStore = []

  if (typeof window !== undefined) {
    const localState = localStorage.getItem(key)

    if (localState) {
      initialState = JSON.parse(localState);
    }
  }

  const store = new ComplexState(initialState)

  if (typeof window !== undefined) {
    store.subscribe(state => {
      localStorage.setItem(key, JSON.stringify(state))
    })
  }

  return store;
}

const store = createPersistedStore();

export default store;