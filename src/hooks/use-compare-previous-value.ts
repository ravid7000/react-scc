import { useEffect, useRef } from "react";
import { isFunction } from '../utils';

function extractPreviousValue<V>(value: V | (() => V)) {
  let val;
  if (isFunction(value)) {
    val = value();
  } else {
    val = value;
  }
  return val;
}

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
  const prevValue = useRef<V>(extractPreviousValue(value));

  useEffect(() => {
    const nextValue = extractPreviousValue(value);
    const result = fn({
      prevValue: prevValue.current,
      value: nextValue,
    });
    prevValue.current = nextValue;
    return result;
  }, [value]);
}
