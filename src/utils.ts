export function noop(_d?: unknown) {}

export function notEqual(a: any, b: any) {
	return a != a ? b == b : a !== b;
}