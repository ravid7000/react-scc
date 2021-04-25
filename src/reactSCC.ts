import React from 'react'
import ReactiveState from './reactiveState'
import { noop } from './utils'
import { Controller, Component } from './types'

function createSCC<P = unknown, S = unknown, C = unknown>({
  state,
  controller,
  component,
  globalState,
}: {
  state: S
  controller?: Controller<React.PropsWithChildren<P>, ReactiveState<S>, C>
  component: Component<React.PropsWithChildren<P>, S, C>
  globalState?: ReactiveState<unknown>
}) {
  return class SCComponent
    extends React.PureComponent<P, { internalState: S, globalState: any }>
    implements React.Component {

    reactiveState!: ReactiveState<S>
    
    controllerValue!: C

    unsubscribeState = noop

    unsubscribeGlobalState = noop

    listeners = {
      onMount: noop,
      onDestroy: noop,
      beforeUpdate: noop,
      afterUpdate: noop,
    }

    constructor(props: P) {
      super(props)

      let initialState = state

      if (typeof state === 'function') {
        initialState = state(props)
      }

      this.state = {
        internalState: initialState,
        globalState: ReactiveState.is(globalState) ? globalState.currentValue : undefined,
      }
      this.reactiveState = new ReactiveState(initialState)
      

      if (controller && typeof controller === 'function') {
        const cv = controller({
          props,
          state: this.reactiveState,
          beforeUpdate: (fn) => this.createLCListener('beforeUpdate', fn),
          onMount: (fn) => this.createLCListener('onMount', fn),
          afterUpdate: (fn) => this.createLCListener('afterUpdate', fn),
          onDestroy: (fn) => this.createLCListener('onDestroy', fn),
        })

        if (cv) {
          this.controllerValue = cv
        }
      }
    }

    componentDidMount() {
      this.initStateSubscribe()
      this.listeners.onMount()
    }

    getSnapshotBeforeUpdate() {
      this.listeners.beforeUpdate(this.props)
      return null
    }

    componentDidUpdate(props: P) {
      this.listeners.afterUpdate(props)
    }

    componentWillUnmount() {
      this.unsubscribeState()
      if (typeof this.unsubscribeGlobalState === 'function') {
        this.unsubscribeGlobalState()
      }
      this.listeners.onDestroy()
    }

    createLCListener(name: string, fn: unknown) {
      if (fn && typeof fn === 'function') {
        this.listeners[name] = fn
      }
    }

    initStateSubscribe() {
      if (this.reactiveState) {
        this.unsubscribeState = this.reactiveState.subscribe((newState) => {
          this.setState((prevState) => {
            return {
              globalState: prevState.globalState,
              internalState: newState,
            }
          })
        })
      }

      if (ReactiveState.is(globalState)) {
        this.unsubscribeGlobalState = globalState.subscribe((newState) => {
          this.setState((prevState) => {
            return {
              internalState: prevState.internalState,
              globalState: newState,
            }
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
        ctrlValue: this.controllerValue,
        state: this.state.internalState,
      })
    }
  }
}

export default createSCC
