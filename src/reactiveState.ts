import { noop, notEqual } from './utils'

type FN<S> = (state: S) => void

type FNE = () => void

class ReactiveState<S> {
  private internalState: S

  private listeners: Array<FN<S>> = []

  constructor(state: S) {
    this.internalState = state
  }

  subscribe(fn: FN<S>): FNE {
    if (fn && typeof fn === 'function') {
      this.listeners.push(fn)

      fn(this.internalState)

      return () => {
        this.listeners = this.listeners.filter((fns) => fns !== fn)
      }
    }

    return noop
  }

  set(newState: S) {
    if (notEqual(newState, this.internalState)) {
      this.internalState = newState
      this.callListeners()
    }
  }

  get currentValue() {
    return this.internalState
  }

  set currentValue(_s) {
    throw new Error('Read Only property "currentValue" cannot be modified')
  }

  update(fn: (state: S) => S) {
    if (fn && typeof fn === 'function') {
      const nextState = fn(this.internalState)

      if (notEqual(nextState, this.internalState)) {
        this.internalState = nextState
        this.callListeners()
      }
    }
  }

  static is(state: any): state is ReactiveState<any> {
    if (state && typeof state === 'object') {
      return 'currentValue' in state && 'update' in state && 'subscribe' in state;
    }
    return false;
  }

  private callListeners() {
    this.listeners.forEach((fn) => {
      fn(this.internalState)
    })
  }
}

export default ReactiveState
