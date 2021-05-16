import { useRef } from 'react';

/**
 * useSetup only runs once during the initialization of the component
 *
 * @param fn Callback Function
 * @returns
 */
export function useSetup<T = undefined>(fn: () => T): T | undefined {
  const once = useRef(true);
  const result = useRef<T>()

  if (once.current) {
    result.current = fn();
    once.current = false;
  }

  return result.current;
}
