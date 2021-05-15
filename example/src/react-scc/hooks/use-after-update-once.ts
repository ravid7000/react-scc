import { useEffect, useRef } from "react";
import { useMounted } from "./use-mounted";

type EffectFunction = (() => void) | (() => () => void);
/**
 * useAfterUpdateOnce hook is called only once after react update the DOM
 * @param fn callback function
 */
 export function useAfterUpdateOnce(fn: EffectFunction) {
  const mounted = useRef(false);
  const once = useRef(true);

  useEffect(() => {
    let result;
    if (mounted.current && once.current) {
      result = fn();
      once.current = false;
    }
    return result;
  });

  useMounted(() => {
    mounted.current = true
  })
}
