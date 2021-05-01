import React from 'react'
import { noop } from './utils'
import { Controller, Component } from './types'

export type CreateSCC<P, C> = {
  /**
   * State is instance of WritableState created with writable or any object that returns a subscribe function
   */
  state?: any
  /**
   * Controller is a function which initialized before mounting of component and never updates. You can use controller to write handlers or abstract business logic of the component.
   */
  controller?: Controller<React.PropsWithChildren<P>, C>
  /**
   * React Component
   */
  component: Component<React.PropsWithChildren<P>, C>
  /**
   * React Component display name
   */
  displayName?: string
}

/**
 * Create an instance of SCC (State, Controller, Component design pattern)
 * @example
 * import { createSCC, writable } from 'react-scc';
 * 
 * const state = writable(0);
 * 
 * const App = createSCC({
 *  state,
 *  controller: () => {
 *    ...
 *  },
 *  component: () => {
 *    // React component
 *  }
 * });
 * 
 * export default App;
 * 
 * @param param0 CreateSCC<Props, CtrlValue>
 * @returns 
 */
function createSCC<P = unknown, C = unknown>({
  state,
  controller,
  component,
  displayName = 'SCComponent',
}: CreateSCC<P, C>) {
  return class SCC extends React.PureComponent<P> {
    static displayName = displayName

    cv!: C

    us = noop

    lunr = {
      onMount: noop,
      onDestroy: noop,
      beforeUpdate: noop,
      afterUpdate: noop,
    }

    constructor(props: P) {
      super(props)

      if (this.isValidState(state)) {
        this.state = {
          internalState: state.currentValue
        }
      }

      if (controller && typeof controller === 'function') {
        const cv = controller({
          props,
          beforeUpdate: (fn) => this.createLCListener('beforeUpdate', fn),
          onMount: (fn) => this.createLCListener('onMount', fn),
          afterUpdate: (fn) => this.createLCListener('afterUpdate', fn),
          onDestroy: (fn) => this.createLCListener('onDestroy', fn),
        })

        if (cv) {
          this.cv = cv
        }
      }
    }

    componentDidMount() {
      this.iss()
      this.lunr.onMount()
    }

    getSnapshotBeforeUpdate() {
      this.lunr.beforeUpdate(this.props)
      return null
    }

    componentDidUpdate(props: P) {
      this.lunr.afterUpdate(props)
    }

    componentWillUnmount() {
      if (typeof this.us === 'function') {
        this.us()
      }
      this.lunr.onDestroy()
    }

    createLCListener(name: string, fn: unknown) {
      if (fn && typeof fn === 'function') {
        this.lunr[name] = fn
      }
    }

    isValidState(state: any): state is { subscribe: (fn: (s: any) => void) => () => void, currentValue: any } {
      return state && typeof state === 'object' && typeof state.subscribe === 'function';
    }

    iss() {
      if (this.isValidState(state)) {
        this.us = state.subscribe((newState) => {
          this.setState({
            internalState: newState,
          })
        })
      }
    }

    render() {
      if (!component || typeof component !== 'function') {
        throw Error('Invalid component type. Component should be a function.')
      }

      return component({
        ...this.props,
        ctrlValue: this.cv,
      })
    }
  }
}

export default createSCC
