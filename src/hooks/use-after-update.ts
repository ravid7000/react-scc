import { useEffect } from "react";

type EffectFunction = (() => void) | (() => () => void);
/**
 * useAfterUpdate hook is called every time after react update the DOM
 * @param fn callback function
 */
 export function useAfterUpdate(fn: EffectFunction) {
  useEffect(fn);
}
