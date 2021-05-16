import React from "react";
import { Writable } from "./store";
import { useSetup, useMounted, useBeforeUpdate, useAfterUpdate } from "./hooks";
import { useWritable, useSubscription } from "./hooks";
import { isFunction, noop } from "./utils";
import { OnMount, BeforeUpdate, AfterUpdate } from "./types";

export type Controller<P = unknown, S = unknown, C = unknown> = (args: {
  props: React.PropsWithChildren<P>;
  state: Writable<S>;
  /* LIFE CYCLES */
  onMount: OnMount;
  beforeUpdate: BeforeUpdate<P>;
  afterUpdate: AfterUpdate<P>;
}) => C;

export type FC<P = unknown, S = unknown, C = unknown> = React.FunctionComponent<
  WrapperComponentProps<P, S, C>
>;

export interface CreateSCC<P, S, C> {
  state: S | (() => S);
  controller?: Controller<P, S, C>;
  displayName?: string;
  subscribe?: any;
  // shouldForwardRef?: boolean;
}

interface LifeCycles<P> {
  onMount: (() => void) | (() => () => void);
  beforeUpdate: (props: P) => void;
  afterUpdate: (props: P) => void;
}

type WrapperComponentProps<P, S, C> = P & {
  ctrlValue: C | undefined;
  state: S;
};

export function createSCC<P = any, S = any, C = any>({
  state,
  controller,
  displayName,
  subscribe,
}: CreateSCC<P, S, C>) {
  const lcs: LifeCycles<P> = {
    onMount: noop,
    beforeUpdate: noop,
    afterUpdate: noop,
  };
  return function wrapWithSCC(
    WrappedComponent: React.FunctionComponent<WrapperComponentProps<P, S, C>>
  ) {
    function BindFn(props: P) {
      const writableState = useWritable(state);

      const ctrlValue = useSetup(() => {
        function createLC(name: keyof LifeCycles<P>, fn: any) {
          lcs[name] = fn;
        }

        if (isFunction(controller)) {
          return controller({
            props,
            state: writableState,
            onMount: (fn) => createLC("onMount", fn),
            beforeUpdate: (fn) => createLC("beforeUpdate", fn),
            afterUpdate: (fn) => createLC("afterUpdate", fn),
          });
        }

        return undefined;
      });

      useMounted(() => lcs.onMount());

      useBeforeUpdate(() => lcs.beforeUpdate(props));

      useAfterUpdate(() => lcs.afterUpdate(props));

      useSubscription(subscribe);

      return (
        <WrappedComponent
          {...props}
          state={writableState.get()}
          ctrlValue={ctrlValue}
        />
      );
    }

    const Bind = React.memo(BindFn);
    Bind.displayName = displayName;
    return Bind;
  };
}
