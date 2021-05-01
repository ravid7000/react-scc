export type FN = () => void

export type OnMount = (fn: FN) => void

export type OnDestroy = OnMount

export type BeforeUpdate<P = unknown> = (fn: (props: P) => void) => void

export type AfterUpdate<P = unknown> = BeforeUpdate<P>

export type Controller<P = unknown, C = unknown> = (args: {
  props: P
  /* LIFE CYCLES */
  onMount: OnMount
  onDestroy: OnDestroy
  beforeUpdate: BeforeUpdate
  afterUpdate: AfterUpdate
}) => C

export type Component<P = unknown, C = unknown> = (
  props: P & { ctrlValue: C }
) => JSX.Element
