import { isFunction, noop, notEqual } from './utils'

type FN<S> = (state: S) => void

type FNE = () => void

type ArrayLikeDict = Record<number, any>

type Callback = (values: ArrayLikeDict) => void

type StartFn<S> = (set: (state: S) => void) => void

export interface Readable<S> {
  /**
   * Get current value of state or use get()
   * @example
   * const counter = writable(0)
   * 
   * counter.get() // 0
   * or
   * get(counter) // 0
   */
  get(): S
  /**
   * Subscribe to the state
   * @example
   * const state = writable(0)
   *
   * state.subscribe(currentState => {
   *  console.log({ currentState })
   * })
   *
   * state.set(1)
   * @param fn subscriber function
   */
  subscribe(fn: FN<S>): FNE
}
export interface Writable<S> extends Readable<S> {
  /**
   * Set a new state
   * @example
   * const state = writable(0)
   *
   * state.subscribe(currentState => {
   *  console.log({ currentState })
   * })
   *
   * state.set(1)
   *
   * @param state new state
   */
  set(state: S): void
  /**
   * Partial update the state
   * @example
   * const state = writable({ todo: [] })
   *
   * const newTodo = {
   *  title: 'Create a writable state',
   *  done: false,
   * }
   *
   * state.update(todo => [...todo, newTodo])
   *
   * @param fn partial state
   */
  update(fn: (state: S) => S): void
}

/**
 * Check if state is Writable
 * @param state any
 * @returns is Writable state
 */
export function isState(state: any): state is Writable<any> {
  return (
    state && typeof state === 'object' && typeof state.subscribe === 'function'
  )
}

/**
 * Get value of Writable | Readable state
 * @param state Writable | Readable
 * @returns state value
 */
 export function get<T>(state: Writable<T> | Readable<T>): T {
  let val: T
  state.subscribe(_ => val = _)
  // @ts-ignore
  return val
}

/**
 * Create an instance of writable state
 * @param state State
 * @returns Subscribable state
 */
export function writable<S>(state: S): Writable<S> {
  const listeners: Array<FN<S>> = []

  let value = state

  const subscribe: Writable<S>['subscribe'] = (fn) => {
    if (isFunction(fn)) {
      listeners.push(fn)

      fn(value)

      return () => {
        const idx = listeners.indexOf(fn)
        if (idx > -1) {
          listeners.splice(idx, 1)
        }
      }
    }

    return noop
  }

  const updateListeners = () => {
    if (listeners.length) {
      listeners.forEach((fn) => fn(value))
    }
  }

  const get: Writable<S>['get'] = () => value

  const set: Writable<S>['set'] = (nextState: S) => {
    if (notEqual(value, nextState)) {
      value = nextState
      updateListeners()
    }
  }

  const update: Writable<S>['update'] = (fn) => {
    set(fn(value))
  }

  return {
    get,
    subscribe,
    set,
    update,
  }
}

/**
 * Create a readonly state
 * @param state any
 * @param start Callback function to update the state
 * @example
 * import { readable } from 'react-scc/writable'
 *
 * const readOnlyState = readable(0, (set, value) => {
 *  setTimeout(() => {
 *    set(value + 1)
 *  }, 1000)
 * })
 *
 * readOnlyState.subscribe((nextValue) => {
 *  console.log(nextValue)
 * })
 * @returns Subscribable state
 */
export function readable<State>(
  state: State,
  start?: StartFn<State>
): Readable<State> {
  const readableState = writable(state)

  if (typeof start === 'function') {
    start(readableState.set)
  }

  return {
    get: () => get(readableState),
    subscribe: readableState.subscribe,
  }
}

/**
 * Subscribe to Readable | Writable state
 * @param state Writable<any> | Readable<any>
 * @param callback Subscriber
 * @returns Unsubscribe
 */
export function subscribe(state: Writable<any> | Readable<any>, callback: FNE) {
  if (!state) {
    return noop
  }

  return state.subscribe(callback)
}

/**
 * Derive values of multiple stores and create single subscriber
 * @example
 * const commonState = combine([state1, state2])
 *
 * commonState.subscribe((values) => {
 *  console.log(values) // { 0: state1Value, 1: state2Value }
 * })
 * @param stores Writable<any>[] | Readable<any>[]
 * @returns Subscribable state
 */
export function combine(stores: Writable<any>[]) {
  const subscribers: Callback[] = []

  let unsubscribe: FNE[] = []

  let values: ArrayLikeDict = {}

  const syncSub = (nextValue: any, idx: number) => {
    const oldValue = values[idx]

    if (notEqual(oldValue, nextValue)) {
      values = { ...values, [idx]: nextValue }
      if (subscribers.length) {
        subscribers.forEach((fn) => fn(values))
      }
    }
  }

  unsubscribe = stores.map((store, idx) =>
    store.subscribe((nextValue) => {
      syncSub(nextValue, idx)
    })
  )

  return {
    get: () => values,
    subscribe: (fn: Callback) => {
      if (isFunction(fn)) {
        subscribers.push(fn)

        fn(values)

        return () => {
          const idx = subscribers.indexOf(fn)
          if (idx > -1) {
            subscribers.splice(idx, 1)

            if (!subscribers.length) {
              unsubscribe.forEach((fn) => fn())
            }
          }
        }
      }

      return noop
    },
  }
}
