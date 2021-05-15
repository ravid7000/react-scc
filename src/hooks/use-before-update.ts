import { useRef } from "react";
import { useMounted } from "./use-mounted";

/**
 * useBeforeUpdate is triggered before updating the component. Caution: avoid updating state.
 * @param fn callback function
 */
export function useBeforeUpdate(fn: () => void) {
  const mounted = useRef(false);

  useMounted(() => {
    mounted.current = true;
  });

  if (mounted.current) {
    fn();
  }
}
