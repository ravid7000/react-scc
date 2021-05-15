import { useState, useRef } from "react";
import { useMounted } from "./use-mounted";
import {
  Writable,
  Readable,
  isState,
} from "../store";
import { noop } from "../utils";

export function useSubscription<S>(
  subscribe: Writable<S> | Readable<S> | undefined
): Writable<S> | Readable<S> | undefined {
  const updateState = useState(() => {
    if (isState(subscribe)) {
      return subscribe.get();
    }
    return;
  });

  const writableState =
    useRef<Writable<S> | Readable<S> | undefined>(subscribe);

  useMounted(() => {
    let unsubscribe = noop;

    if (isState(subscribe)) {
      unsubscribe = subscribe.subscribe(updateState[1]);
    }
    return unsubscribe;
  });

  return writableState.current;
}
