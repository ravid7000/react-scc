import React from 'react'
import { noop, isFunction } from './utils'
import { CreateSCC } from './types'
import { writable, Writable, isState } from './store'

/**
 * Create an instance of SCC (State, Controller, Component design pattern)
 * @example
 * import { createSCC, writable } from 'react-scc';
 *
 * const App = createSCC({
 *  state: 0,
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
 * @param options CreateSCC<Props, State, CtrlValue>
 * @returns JSX.Element | null | undefined
 */
function createSCC<P = any, S = any, C = any>({
  state,
  controller,
  component,
  displayName = 'SCComponent',
  subscribe,
  defaultProps,
}: CreateSCC<P, S, C>) {
  return class SCC extends React.PureComponent<P, { in: S; out: any }> {
    static displayName = displayName

    static defaultProps = defaultProps

    intSt!: Writable<S>

    cv!: C

    inUs = noop

    outUs = noop

    lunr = {
      onMount: noop,
      onDestroy: noop,
      beforeUpdate: noop,
      afterUpdate: noop,
    }

    constructor(props: P) {
      super(props)

      this.intSt = writable(state)

      if (isFunction(controller)) {
        const cv = controller({
          props,
          state: this.intSt,
          beforeUpdate: (fn) => this.createLCListener('beforeUpdate', fn),
          onMount: (fn) => this.createLCListener('onMount', fn),
          afterUpdate: (fn) => this.createLCListener('afterUpdate', fn),
          onDestroy: (fn) => this.createLCListener('onDestroy', fn),
        })

        if (cv) {
          this.cv = cv
        }
      }

      this.state = {
        in: this.intSt.get(),
        out: isState(subscribe) ? subscribe.get() : null,
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
      this.lunr.onDestroy()
      if (isFunction(this.outUs)) {
        this.outUs()
      }
      this.inUs()
    }

    createLCListener(name: string, fn: unknown) {
      if (isFunction(fn)) {
        this.lunr[name] = fn
      }
    }

    iss() {
      this.inUs = this.intSt.subscribe((newState) => {
        this.setState((prevState) => ({
          in: newState,
          out: prevState.out,
        }))
      })
      if (isState(subscribe)) {
        this.outUs = subscribe.subscribe((newState) => {
          this.setState((prevState) => ({
            in: prevState.in,
            out: newState,
          }))
        })
      }
    }

    render() {
      if (!component || !isFunction(component)) {
        throw Error('Invalid component type. Component should be a function.')
      }

      return component({
        ...this.props,
        ctrlValue: this.cv,
        state: this.state.in,
      })
    }
  }
}

export default createSCC
