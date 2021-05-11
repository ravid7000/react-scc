import { useState, useRef, useEffect } from 'react'
import { useMounted } from './core'
import { writable, Writable, readable, Readable, StartFn, isState } from '../store'
import { isFunction, noop } from '../utils'

export function useWritable<S>(initialState: S | (() => S)) {
  const [_, updateState] = useState(initialState)
  const unsubscribe = useRef(noop)
  const writableState = useRef<Writable<S>>()

  if (!writableState.current) {
    let state: S
    if (isFunction(initialState)) {
      state = initialState()
    } else {
      state = initialState
    }

    writableState.current = writable(state)
    unsubscribe.current = writableState.current.subscribe(nextState => updateState(nextState))
  }

  useEffect(() => unsubscribe.current, [])

  return writableState.current
}

export function useReadable<S>(initialState: S | (() => S), fn: StartFn<S>) {
  const [_, updateState] = useState(initialState)
  const unsubscribe = useRef(noop)
  const readableState = useRef<Readable<S>>()

  if (!readableState.current) {
    let state: S
    if (isFunction(initialState)) {
      state = initialState()
    } else {
      state = initialState
    }

    readableState.current = readable(state, fn)
    unsubscribe.current = readableState.current.subscribe(nextState => updateState(nextState))
  }

  useEffect(() => unsubscribe.current, [])

  return readableState.current
}


export function useSubscription<S>(subscribe: Writable<S> | Readable<S> | undefined): Writable<S> | Readable<S> | undefined {
  const [_, updateState] = useState(() => {
    if (isState(subscribe)) {
      return subscribe.get()
    }
    return
  })

  const writableState = useRef<Writable<S> | Readable<S> | undefined>(subscribe)

  useMounted(() => {
    let unsubscribe = noop

    if (isState(subscribe)) {
      unsubscribe = subscribe.subscribe((nextState) => {
        updateState(nextState)
      })
    }

    return unsubscribe
  })

  return writableState.current
}
