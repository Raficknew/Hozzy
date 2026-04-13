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
    const givenAction = vi.fn().mockResolvedValue({
      error: false,
      message: "Operation successful",
    });
    const givenOnSuccess = vi.fn();

    const whenSubmitAction = performFormSubmitAction(
      givenAction,
      givenOnSuccess,
    );

    await whenSubmitAction;

    expect(givenAction).toHaveBeenCalledTimes(1);
    expect(givenOnSuccess).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Operation successful");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows error toast and does not call onSuccess when action fails", async () => {
    const givenAction = vi.fn().mockResolvedValue({
      error: true,
      message: "Operation failed",
    });
    const givenOnSuccess = vi.fn();

    const whenSubmitAction = performFormSubmitAction(
      givenAction,
      givenOnSuccess,
    );

    await whenSubmitAction;

    expect(givenAction).toHaveBeenCalledTimes(1);
    expect(givenOnSuccess).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Operation failed");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("works without onSuccess callback", async () => {
    const givenAction = vi.fn().mockResolvedValue({
      error: false,
      message: "Success without callback",
    });

    const whenSubmitAction = performFormSubmitAction(givenAction);

    await whenSubmitAction;

    expect(givenAction).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Success without callback");
  });

  it("handles async action execution", async () => {
    const givenAction = vi
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
    const givenOnSuccess = vi.fn();

    const whenSubmitAction = performFormSubmitAction(
      givenAction,
      givenOnSuccess,
    );

    await whenSubmitAction;

    expect(givenAction).toHaveBeenCalledTimes(1);
    expect(givenOnSuccess).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("Delayed success");
  });
});
