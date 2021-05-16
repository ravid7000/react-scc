import { useState, useRef } from "react";
import {
  readable,
  Readable,
  StartFn,
} from "../store";
import { isFunction } from "../utils";

import { useMounted } from "./use-mounted";

function extractInitialState<S>(initialState: S | (() => S)) {
  let state: S;
  if (isFunction(initialState)) {
    state = initialState();
  } else {
    state = initialState;
  }
  return state;
}

export function useReadable<S>(initialState: S | (() => S), fn: StartFn<S>) {
  const updateState = useState(initialState);
  const readableState = useRef<Readable<S>>(
    readable(extractInitialState(initialState), fn)
  );

  useMounted(() => readableState.current.subscribe(updateState[1]));

  return readableState.current;
}
