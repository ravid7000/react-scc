import { useState, useRef, useEffect } from "react";
import {
  readable,
  Readable,
  StartFn,
} from "../store";
import { isFunction, noop } from "../utils";

export function useReadable<S>(initialState: S | (() => S), fn: StartFn<S>) {
  const updateState = useState(initialState);
  const unsubscribe = useRef(noop);
  const readableState = useRef<Readable<S>>();

  useEffect(() => unsubscribe.current, []);

  if (!readableState.current) {
    let state: S;
    if (isFunction(initialState)) {
      state = initialState();
    } else {
      state = initialState;
    }

    readableState.current = readable(state, fn);
    unsubscribe.current = readableState.current.subscribe(updateState[1]);
  }

  return readableState.current;
}
