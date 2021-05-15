import { useEffect } from "react";

type EffectFunction = (() => void) | (() => () => void);
/**
 * useMounted is called after component renders the DOM only once. This hook can be used to subscribe to any event listener or call an api
 *
 * @example
 * useMounted(() => {
 *  callApi().then(res => setState(res))
 *  return () => {
 *    // This function will be called once component unmounted
 *  }
 * })
 *
 * @param fn callback function
 */
 export function useMounted(fn: EffectFunction) {
  useEffect(() => {
    return fn();
  }, []);
}
