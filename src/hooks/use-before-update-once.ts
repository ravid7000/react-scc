import { useRef } from "react";
import { useMounted } from "./use-mounted";

/**
 * useBeforeUpdateOnce is triggered only once before updating the component.
 * @param fn callback function
 */
export function useBeforeUpdateOnce(fn: () => void) {
  const mounted = useRef(false);
  const once = useRef(true);

  if (mounted.current && once.current) {
    fn();
    once.current = false;
  }

  useMounted(() => {
    mounted.current = true;
  });
}
