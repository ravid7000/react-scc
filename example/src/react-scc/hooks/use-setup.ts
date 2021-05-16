import { useRef } from 'react';
import { useMounted } from './use-mounted';

export function createSetup() {
  let mounted = false;
  let result: any;
  return function useSetup<T = undefined>(fn: () => T): T {
    if (!mounted) {
      result = fn();
      mounted = true
    }
    return result as T;
  }
}

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
  
  // useMounted(() => {
  //   once.current = false;
  // })

  return result.current;
}
