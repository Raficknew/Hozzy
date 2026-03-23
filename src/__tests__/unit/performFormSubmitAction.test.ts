import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { performFormSubmitAction } from "@/global/functions";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("performFormSubmitAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows success toast and calls onSuccess when action succeeds", async () => {
    const action = vi.fn().mockResolvedValue({
      error: false,
      message: "Operation successful",
    });
    const onSuccess = vi.fn();

    await performFormSubmitAction(action, onSuccess);

    expect(action).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Operation successful");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows error toast and does not call onSuccess when action fails", async () => {
    const action = vi.fn().mockResolvedValue({
      error: true,
      message: "Operation failed",
    });
    const onSuccess = vi.fn();

    await performFormSubmitAction(action, onSuccess);

    expect(action).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Operation failed");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("works without onSuccess callback", async () => {
    const action = vi.fn().mockResolvedValue({
      error: false,
      message: "Success without callback",
    });

    await performFormSubmitAction(action);

    expect(action).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Success without callback");
  });

  it("handles async action execution", async () => {
    const action = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ error: false, message: "Delayed success" }),
              10,
            ),
          ),
      );
    const onSuccess = vi.fn();

    await performFormSubmitAction(action, onSuccess);

    expect(action).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Delayed success");
  });
});
