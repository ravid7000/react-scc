import { useEffect, useRef } from "react";
import { isFunction } from '../utils';
import { useSetup } from './use-setup';

/**
 * useComparePreviousValue is used to call a function with previous and current values
 *
 * @example
 *
 * @param fn callback function
 * @param value any value
 */
 export function useComparePreviousValue<V>(
  fn: (args: { prevValue: V; value: V }) => void,
  value: V | (() => V)
) {
  const prevValue = useRef<V>();

  function extractPreviousValue() {
    let val;
    if (isFunction(value)) {
      val = value();
    } else {
      val = value;
    }
    return val;
  }

  useSetup(() => {
    prevValue.current = extractPreviousValue();
  });

  useEffect(() => {
    const nextValue = extractPreviousValue();
    const result = fn({
      prevValue: prevValue.current || nextValue,
      value: nextValue,
    });
    prevValue.current = nextValue;
    return result;
  }, [value]);
}
