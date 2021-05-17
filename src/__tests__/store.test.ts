import { writable, combine, readable } from "../store";

describe("Test: writable", () => {
  test("should create writable state", () => {
    const state = writable(0);
    expect(state.get()).toStrictEqual(0);
  });
  test("should update writable state", () => {
    const state = writable(0);
    expect(state.get()).toStrictEqual(0);
    state.update((count) => count + 1);
    expect(state.get()).toStrictEqual(1);
  });
  test("should set writable state", () => {
    const state = writable(0);
    expect(state.get()).toStrictEqual(0);
    state.set(1);
    expect(state.get()).toStrictEqual(1);
  });
  test("should subscribe writable state", () => {
    const state = writable(0);
    const subscriber = jest.fn();
    expect(state.get()).toStrictEqual(0);
    state.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
  test("should unsubscribe writable state", () => {
    const state = writable(0);
    const subscriber = jest.fn();
    expect(state.get()).toStrictEqual(0);
    const unsubscribe = state.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toBeInstanceOf(Function);
    unsubscribe();
    state.set(1);
    state.set(2);
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
  test("should combine 2 writable state", () => {
    const state1 = writable(0);
    const state2 = writable(false);
    const subscriber = jest.fn();
    const combinedState = combine([state1, state2]);
    expect(combinedState.get()).toEqual({ "0": 0, "1": false });
    const unsubscribe = combinedState.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(1);
    state1.set(2);
    expect(subscriber).toHaveBeenCalledTimes(2);
    state2.set(true);
    expect(subscriber).toHaveBeenCalledTimes(3);
    unsubscribe();
    state2.set(false);
    expect(subscriber).toHaveBeenCalledTimes(3);
  });
});

describe("Test: readable", () => {
  test("should create readable state", () => {
    const state = readable(0, ({ get, set }) => {
      set(get() + 1)
    })
    expect(state.get()).toStrictEqual(1);
    const subscriber = jest.fn();
    const unsubscribe = state.subscribe(subscriber);
    expect(subscriber).toHaveBeenCalledTimes(1);
    unsubscribe();
    expect(subscriber).toHaveBeenCalledTimes(1);
  })
})
