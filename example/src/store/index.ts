import { ReactiveState } from 'react-scc'

const key = 'todoStore';

type TodoStore = { done: boolean, title: string, id: number }[]

// persist store value in localStorage
function createPersistedStore() {
  let initialState: TodoStore = []

  if (typeof window !== undefined) {
    const localState = localStorage.getItem(key)

    if (localState) {
      initialState = JSON.parse(localState);
    }
  }

  const store = new ReactiveState(initialState)

  if (typeof window !== undefined) {
    store.subscribe(state => {
      localStorage.setItem(key, JSON.stringify(state))
    })
  }

  return store;
}

export default createPersistedStore();