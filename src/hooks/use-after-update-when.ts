import { useEffect, useRef } from "react";
import { useMounted } from "./use-mounted";
import { isFunction } from '../utils';

type EffectFunction = (() => void) | (() => () => void);
/**
 * useAfterUpdateWhen is called conditionally after react update the DOM. This hook will be called when the condition as second parameter becomes true.
 * @param fn callback function
 * @param condition boolean
 */
 export function useAfterUpdateWhen(
  fn: EffectFunction,
  condition: boolean | (() => boolean)
) {
  const mounted = useRef(false);

  useEffect(() => {
    let result;
    let canCall;

    if (mounted.current) {
      if (isFunction(condition)) {
        canCall = condition();
      } else {
        canCall = condition;
      }
  
      if (canCall) {
        result = fn();
      }
    }

    return result;
  });

  useMounted(() => {
    mounted.current = true
  })
}
