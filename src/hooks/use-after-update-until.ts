import { useEffect } from "react";
import { isFunction } from '../utils';

type EffectFunction = (() => void) | (() => () => void);
/**
 * useAfterUpdateUntil is called conditionally after react update the DOM. This hook will be called every time until the condition as second parameter becomes false.
 *
 * @example
 * const [counter, setCounter] = useState(0)
 *
 * const timer = useRef()
 *
 * useMounted(() => {
 *  timer.current = setTimeout(() => {
 *    setCounter(count => count + 1)
 *  }, 1000)
 * })
 *
 * useAfterUpdateUntil(() => {
 *  clearTimeout(timer.current) // When counter value is 11 the timer will be cleared
 * }, counter > 10)
 *
 * @param fn callback function
 * @param condition Boolean
 */
 export function useAfterUpdateUntil(
  fn: EffectFunction,
  condition: boolean | (() => boolean)
) {
  useEffect(() => {
    let result;
    let canCall;

    if (isFunction(condition)) {
      canCall = condition();
    } else {
      canCall = condition;
    }

    if (!canCall) {
      result = fn();
    }

    return result;
  });
}
