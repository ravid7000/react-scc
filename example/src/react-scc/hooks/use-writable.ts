import { useState, useRef, useEffect } from "react";
import { writable, Writable } from "../store";
import { isFunction, noop } from "../utils";
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

export function useWritable<S>(initialState: S | (() => S)) {
  const updateState = useState(initialState);
  const writableState = useRef<Writable<S>>(
    writable(extractInitialState(initialState))
  );

  useMounted(() => writableState.current.subscribe(updateState[1]));

  return writableState.current;
}
