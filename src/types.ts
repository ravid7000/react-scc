/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export type FN = () => void

export type OnMount = (fn: FN) => void

export type OnDestroy = OnMount

export type BeforeUpdate<P = unknown> = (fn: (props: P) => void) => void

export type AfterUpdate<P = unknown> = BeforeUpdate<P>

export type Context<T = any> = React.Context<T>

export type Controller<P = unknown, S = unknown, C = unknown> = (args: {
  props: P
  state: S
  context: Context
  /* LIFE CYCLES */
  onMount: OnMount
  onDestroy: OnDestroy
  beforeUpdate: BeforeUpdate
  afterUpdate: AfterUpdate
}) => C

export type Component<P = unknown, S = unknown, C = unknown, Ctx = Context> = (
  props: P & { ctrlValue: C, state: S; contextValue: Ctx }
) => JSX.Element
