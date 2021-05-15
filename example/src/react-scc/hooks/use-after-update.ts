import { useEffect, useRef } from "react";
import { useMounted } from "./use-mounted";

type EffectFunction = (() => void) | (() => () => void);
/**
 * useAfterUpdate hook is called every time after react update the DOM
 * @param fn callback function
 */
export function useAfterUpdate(fn: EffectFunction) {
  const mounted = useRef(false);
  
  useEffect(() => {
    let result;
    if (mounted.current) {
      result = fn()
    }
    return result;
  });

  useMounted(() => {
    mounted.current = true;
  });
}
