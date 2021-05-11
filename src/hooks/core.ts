import { useRef, useEffect } from 'react'
import { isFunction } from '../utils'

type EffectFunction = (() => void) | (() => () => void)

/**
 * useOnce only runs once during the initialization of the component
 * 
 * @param fn Callback Function
 * @returns
 */
export function useOnce<T>(fn: () => T): T {
  const once = useRef(true)
  let result: T

  if (once.current) {
    result = fn()
    once.current = false
  }

  // @ts-ignore
  return result
}

/**
 * useSetup is similar to useOnce
 */
export const useSetup = useOnce

/**
 * useMounted is called after component renders the DOM only once. This hook can be used to subscribe to any event listener or call an api
 * 
 * @example
 * useMounted(() => {
 *  callApi().then(res => setState(res))
 *  return () => {
 *    // This function will be called once component unmounted
 *  }
 * })
 * 
 * @param fn callback function
 */
export function useMounted(fn: EffectFunction) {
  useEffect(() => {
    return fn()
  }, [])
}

/**
 * useAfterUpdate hook is called every time after react update the DOM
 * @param fn callback function
 */
export function useAfterUpdate(fn: EffectFunction) {
  useEffect(fn)
}

/**
 * useAfterUpdateOnce hook is called only once after react update the DOM
 * @param fn callback function
 */
export function useAfterUpdateOnce(fn: EffectFunction) {
  const once = useRef(true)

  useEffect(() => {
    let result
    if (once.current) {
      result = fn()
      once.current = true
    }
    return result
  })
}

/**
 * useAfterUpdateUntil is called conditionally after react update the DOM. This hook will be called every time until the condition as second parameter becomes false.
 * 
 * @example
 * const [counter, setCounter] = useState(0)
 * 
 * const timer = useRef()
 * 
 * useMounted(() => {
 *  timer.current = setTimeout(() => {
 *    setCounter(count => count + 1)
 *  }, 1000)
 * })
 * 
 * useAfterUpdateUntil(() => {
 *  clearTimeout(timer.current) // When counter value is 11 the timer will be cleared
 * }, counter > 10)
 * 
 * @param fn callback function
 * @param condition Boolean
 */
export function useAfterUpdateUntil(fn: EffectFunction, condition: boolean | (() => boolean)) {
  useEffect(() => {
    let result
    let canCall

    if (isFunction(condition)) {
      canCall = condition()
    } else {
      canCall = condition
    }

    if (!canCall) {
      result = fn()
    }

    return result
  })
}

/**
 * useAfterUpdateWhen is called conditionally after react update the DOM. This hook will be called when the condition as second parameter becomes true.
 * @param fn callback function
 * @param condition boolean
 */
export function useAfterUpdateWhen(fn: EffectFunction, condition: boolean | (() => boolean)) {
  useEffect(() => {
    let result
    let canCall

    if (isFunction(condition)) {
      canCall = condition()
    } else {
      canCall = condition
    }

    if (canCall) {
      result = fn()
    }

    return result
  })
}

/**
 * useComparePreviousValue is used to call a function with previous and current values
 * 
 * @example
 * 
 * @param fn callback function
 * @param value any value
 */
export function useComparePreviousValue<V>(fn: (args: { prevValue: V, value: V }) => void, value: V | (() => V)) {
  const prevValue = useRef<V>()

  function extractPreviousValue() {
    let val
    if (isFunction(value)) {
      val = value()
    } else {
      val = value
    }
    return val
  }

  useSetup(() => {
    prevValue.current = extractPreviousValue()
  })

  useEffect(() => {
    const nextValue = extractPreviousValue()
    const result = fn({ prevValue: prevValue.current || nextValue, value: nextValue })
    prevValue.current = nextValue
    return result
  }, [value])
}

/**
 * useBeforeUpdate is triggered before updating the component. Caution: avoid updating state.
 * @param fn callback function
 */
export function useBeforeUpdate(fn: () => void) {
  const mounted = useRef(false)

  useMounted(() => {
    mounted.current = true
  })

  if (mounted.current) {
    fn()
  }
}

/**
 * useBeforeUpdateOnce is triggered only once before updating the component.
 * @param fn callback function
 */
export function useBeforeUpdateOnce(fn: () => void) {
  const mounted = useRef(false)
  const once = useRef(true)

  useMounted(() => {
    mounted.current = true
  })

  if (mounted.current && once.current) {
    fn()
    once.current = false
  }
}
