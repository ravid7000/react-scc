import { noop, notEqual } from './utils'

type FN<S> = (state: S) => void

type FNE = () => void

type ArrayLikeDict = Record<number, any>

type Callback = (values: ArrayLikeDict) => void

export interface Writable<S> {
  readonly currentValue: S;
  subscribe(fn: FN<S>): FNE;
  set(state: S): void;
  update(fn: (state: S) => S): void;
}


/**
 * Extends WritableState to create complex state
 */
export class WritableState<S> implements Writable<S> {
  private $intSt: S

  private listeners: Array<FN<S>> = []

  constructor(state: S) {
    this.$intSt = state
  }

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
  subscribe(fn: FN<S>): FNE {
    if (fn && typeof fn === 'function') {
      this.listeners.push(fn)

      fn(this.$intSt)

      return () => {
        const idx = this.listeners.indexOf(fn)
        if (idx > -1) {
          this.listeners.splice(idx, 1)
        }
      }
    }

    return noop
  }

  /**
   * Get currentValue of state. This is readOnly property
   */
  get currentValue() {
    return this.$intSt
  }

  set currentValue(_s) {
    throw new Error('Read Only property "currentValue" cannot be modified')
  }

  static is(state: any): state is WritableState<any> {
    return state && typeof state === 'object' && typeof state.subscribe === 'function';
  }

  private $$clUp() {
    this.listeners.forEach((fn) => {
      fn(this.$intSt)
    })
  }

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
  set(newState: S) {
    if (notEqual(newState, this.$intSt)) {
      this.$intSt = newState
      this.$$clUp()
    }
  }

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
  update(fn: (state: S) => S) {
    if (fn && typeof fn === 'function') {
      const nextState = fn(this.$intSt)

      if (notEqual(nextState, this.$intSt)) {
        this.$intSt = nextState
        this.$$clUp()
      }
    }
  }
}

export function compose(states: Writable<any>[]) {
  const commonState: Record<number, unknown> = {}
  const unsubscribes: FNE[] = []

  const subscribe = (fn: FN<any>) => {
    if (states && Array.isArray(states) && typeof fn === 'function') {
      states.forEach((state, idx) => {
        if (WritableState.is(state)) {
          unsubscribes[idx] = state.subscribe(newValue => {
            commonState[idx] = newValue
            if (idx === states.length - 1) {
              fn(commonState)
            }
          });
        }
      })
    }

    return () => {
      if (unsubscribes && unsubscribes.length) {
        unsubscribes.forEach(unFn => unFn());
      }
    }
  }

  return {
    currentValue: commonState,
    subscribe,
  }
}

/**
 * Create an instance of writable state
 * @param state State
 * @returns 
 */
export function writable<State>(state: State): Writable<State> {
  return new WritableState(state)
}

/**
 * Derive values of multiple stores and create single subscriber
 * @example
 * const commonState = combine([state1, state2])
 * 
 * commonState.subscribe((values) => {
 *  console.log(values) // { 0: state1Value, 1: state2Value }
 * })
 * @param stores Writable<any>[]
 * @returns { currentValue: any[], subscribe:  }
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
        subscribers.forEach(fn => fn(values))
      }
    }
  }

  unsubscribe = stores.map((store, idx) => store.subscribe((nextValue) => {
    syncSub(nextValue, idx)
  }))

  return {
    currentValue: values,
    subscribe: (fn: Callback) => {
      if (fn && typeof fn === 'function') {
        subscribers.push(fn)

        fn(values)

        return () => {
          const idx = subscribers.indexOf(fn)
          if (idx > -1) {
            subscribers.splice(idx, 1)

            if (!subscribers.length) {
              unsubscribe.forEach(fn => fn())
            }
          }
        }
      }

      return noop
    }
  }
}

