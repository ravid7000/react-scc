import { renderHook } from "@testing-library/react-hooks";
import { useMounted } from "../use-mounted";

describe("Test: useMounted", () => {
  test("should called once after component mounted", () => {
    const callback = jest.fn();
    renderHook(() => useMounted(callback));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
