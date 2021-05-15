import { useState, useRef, useEffect } from "react";
import {
  writable,
  Writable,
} from "../store";
import { isFunction, noop } from "../utils";

export function useWritable<S>(initialState: S | (() => S)) {
  const updateState = useState(initialState);
  const unsubscribe = useRef(noop);
  const writableState = useRef<Writable<S>>();

  useEffect(() => unsubscribe.current, []);

  if (!writableState.current) {
    let state: S;
    if (isFunction(initialState)) {
      state = initialState();
    } else {
      state = initialState;
    }

    writableState.current = writable(state);
    unsubscribe.current = writableState.current.subscribe(updateState[1]);
  }

  return writableState.current;
}
