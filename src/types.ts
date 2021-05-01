import { Writable } from "./writable"

export type FN = () => void

export type OnMount = (fn: FN) => void

export type OnDestroy = OnMount

export type BeforeUpdate<P> = (fn: (props: P) => void) => void

export type AfterUpdate<P> = BeforeUpdate<P>

export type Controller<P, S, C> = (args: {
  props: P
  state: S
  /* LIFE CYCLES */
  onMount: OnMount
  onDestroy: OnDestroy
  beforeUpdate: BeforeUpdate<P>
  afterUpdate: AfterUpdate<P>
}) => C

export type Component<P, S, C> = (
  props: P & { ctrlValue: C, state: S }
) => JSX.Element | null | undefined

export type CreateSCC<P, S, C> = {
  /**
   * State is instance of WritableState created with writable or any object that returns a subscribe function
   */
  state: S
  /**
   * Controller is a function which initialized before mounting of component and never updates. You can use controller to write handlers or abstract business logic of the component.
   */
  controller?: Controller<React.PropsWithChildren<P>, Writable<S>, C>
  /**
   * React Component
   */
  component: Component<React.PropsWithChildren<P>, S, C>
  /**
   * React Component display name
   */
  displayName?: string
  /**
   * Subscribe to external writable state
   */
  subscribe?: any
  /**
   * Component default props
   */
   defaultProps?: Partial<P>
}