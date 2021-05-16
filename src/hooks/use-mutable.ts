import { useRef } from "react";
import { isFunction } from "../utils";

type MutableType<T> = {
  current: T
}

/**
 * useMutable is extended version of useRef. Which can accept function to define the initial state.
 * 
 * @example
 * 
 * const ref = useMutable(() => {
 *   return 1
 * })
 * 
 * @param initialState 
 * @returns 
 */
export function useMutable<T = undefined>(initialState: T | (() => T)): MutableType<T> {
  const ref = useRef(initialState)

  if (!arguments[1]) {
    const state = isFunction(initialState) ? initialState() : initialState
    arguments[1] = state;
    ref.current = state;
  }

  return ref as MutableType<T>;
}
