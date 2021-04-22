import React from 'react'
import ReactiveState from './reactiveState'
import { noop } from './utils'
import { Controller, Component, Context } from './types'

function createSCC<P = unknown, S = unknown, C = unknown, Ctx = Context>({
  state,
  controller,
  component,
  context,
}: {
  state: S
  controller?: Controller<P, ReactiveState<S>, C>
  component: Component<P, S, C, Ctx>
  context?: Ctx
}): React.ReactNode {
  return class SCComponent
    extends React.PureComponent<P, { internalState: S }>
    implements React.Component {
    static context = context

    reactiveState: ReactiveState<S>

    unsubscribeState = noop

    controllerValue!: C

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
      }
      this.reactiveState = new ReactiveState(initialState)

      if (controller && typeof controller === 'function') {
        const cv = controller({
          props,
          state: this.reactiveState,
          context: this.context,
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
      this.listeners.onDestroy()
    }

    createLCListener(name: string, fn: unknown) {
      if (fn && typeof fn === 'function') {
        this.listeners[name] = fn
      }
    }

    initStateSubscribe() {
      this.unsubscribeState = this.reactiveState.subscribe((newState) => {
        this.setState({
          internalState: newState,
        })
      })
    }

    render() {
      if (!component || typeof component !== 'function') {
        throw Error('Invalid component type. Component should be a function.')
      }

      return component({
        ...this.props,
        ...this.controllerValue,
        componentState: this.state.internalState,
        contextValue: this.context,
      })
    }
  }
}

export default createSCC
