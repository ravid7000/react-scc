import { useRef } from 'react';
import { useMounted } from './use-mounted';

/**
 * useSetup only runs once during the initialization of the component
 *
 * @param fn Callback Function
 * @returns
 */
export function useSetup<T = undefined>(fn: () => T): T | undefined {
  const once = useRef(true);
  const result = useRef<T>();

  useMounted(() => once.current = false)

  if (once.current) {
    result.current = fn();
  }

  return result.current;
}
