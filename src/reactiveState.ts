import { noop } from './utils'

type FN<S> = (state: S) => void

type FNE = () => void

class ReactiveState<S = unknown> {
  private internalState: S

  listeners: Array<FN<S>> = []

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
    const nextState = newState
    if (nextState !== this.internalState) {
      this.internalState = nextState
      this.callListeners()
    }
  }

  get currentValue() {
    return this.internalState
  }

  update(fn: (state: S) => S) {
    if (fn && typeof fn === 'function') {
      const nextState = fn(this.internalState)

      if (nextState !== this.internalState) {
        this.internalState = nextState
        this.callListeners()
      }
    }
  }

  private callListeners() {
    this.listeners.forEach((fn) => {
      if (fn && typeof fn === 'function') {
        fn(this.internalState)
      }
    })
  }
}

export default ReactiveState
