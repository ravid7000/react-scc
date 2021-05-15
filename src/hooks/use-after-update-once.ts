import { useEffect, useRef } from "react";

type EffectFunction = (() => void) | (() => () => void);
/**
 * useAfterUpdateOnce hook is called only once after react update the DOM
 * @param fn callback function
 */
 export function useAfterUpdateOnce(fn: EffectFunction) {
  const once = useRef(true);

  useEffect(() => {
    let result;
    if (once.current) {
      result = fn();
      once.current = true;
    }
    return result;
  });
}
