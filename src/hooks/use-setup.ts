import { useRef } from "react";

/**
 * useOnce only runs once during the initialization of the component
 *
 * @param fn Callback Function
 * @returns
 */
export function useSetup<T>(fn: () => T): T {
  const once = useRef(true);
  let result: T;

  if (once.current) {
    result = fn();
    once.current = false;
  }

  // @ts-ignore
  return result;
}
