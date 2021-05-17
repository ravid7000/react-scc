import { renderHook, act } from "@testing-library/react-hooks";
import { useWritable } from "../use-writable";

describe("Test: useWritable", () => {
  test("should create writable state", () => {
    const { result } = renderHook(() => useWritable(0));
    expect(result.current.get()).toStrictEqual(0);
  });
  test("should update state", () => {
    const { result } = renderHook(() => useWritable(0));
    expect(result.current.get()).toStrictEqual(0);
    act(() => {
      result.current.set(1);
    })
    expect(result.current.get()).toStrictEqual(1);
    act(() => {
      result.current.update(count => count + 1);
    })
    expect(result.current.get()).toStrictEqual(2);
  });
  test("should subscribe state", () => {
    const subscriber = jest.fn()
    const { result } = renderHook(() => useWritable(0));
    expect(result.current.get()).toStrictEqual(0);
    act(() => {
      result.current.subscribe(subscriber);
    })
    expect(result.current.get()).toStrictEqual(0);
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
});
