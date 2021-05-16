import { isFunction } from "../utils";

type MutableType<T> = {
  current: T
}

export function useMutable<T = undefined>(initialState: T | (() => T)): MutableType<T> {
  if (arguments[1]) {
    return arguments[1];
  }
  arguments[1] = { current: isFunction(initialState) ? initialState(): initialState };
  return { current: isFunction(initialState) ? initialState(): initialState }
}
