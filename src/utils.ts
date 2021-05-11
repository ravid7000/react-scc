/* eslint-disable eqeqeq */
export function noop(_d?: unknown) { }

export function notEqual(a: any, b: any) {
  // eslint-disable-next-line no-self-compare
  return a != a ? b == b : a !== b
}

export function isFunction(arg: any): arg is Function {
  return typeof arg === 'function'
}
