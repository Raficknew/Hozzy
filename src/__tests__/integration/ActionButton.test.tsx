import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import { ActionButton } from "@/components/atoms/ActionButton";

describe("ActionButton Integration Tests", () => {
  it("should render a button with children", () => {
    const mockAction = vi
      .fn()
      .mockResolvedValue({ error: false, message: "Success" });
    render(<ActionButton action={mockAction}>Click me</ActionButton>);

    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("should call action when button is clicked", async () => {
    const mockAction = vi
      .fn()
      .mockResolvedValue({ error: false, message: "Success" });

    const { user } = render(
      <ActionButton action={mockAction}>Submit</ActionButton>,
    );

    const button = screen.getByRole("button", { name: /submit/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
  });

  it("should disable button while action is pending", async () => {
    const mockAction = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ error: false, message: "Success" }),
              100,
            ),
          ),
      );

    const { user } = render(
      <ActionButton action={mockAction}>Process</ActionButton>,
    );

    const button = screen.getByRole("button", { name: /process/i });
    await user.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("should show loading state during action execution", async () => {
    const mockAction = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ error: false, message: "Success" }),
              100,
            ),
          ),
      );

    const { user } = render(
      <ActionButton action={mockAction}>Save</ActionButton>,
    );

    const button = screen.getByRole("button", { name: /save/i });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("should handle successful action response", async () => {
    const mockAction = vi
      .fn()
      .mockResolvedValue({ error: false, message: "Operation successful" });

    const { user } = render(
      <ActionButton action={mockAction}>Execute</ActionButton>,
    );

    const button = screen.getByRole("button", { name: /execute/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });

  it("should handle error action response", async () => {
    const mockAction = vi
      .fn()
      .mockResolvedValue({ error: true, message: "Operation failed" });

    const { user } = render(
      <ActionButton action={mockAction}>Delete</ActionButton>,
    );

    const button = screen.getByRole("button", { name: /delete/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });

  describe("with requireAreYouSure", () => {
    it("should render alert dialog trigger button", () => {
      const mockAction = vi
        .fn()
        .mockResolvedValue({ error: false, message: "Success" });

      render(
        <ActionButton action={mockAction} requireAreYouSure>
          Dangerous Action
        </ActionButton>,
      );

      expect(
        screen.getByRole("button", { name: /dangerous action/i }),
      ).toBeInTheDocument();
    });

    it("should show confirmation dialog when button is clicked", async () => {
      const mockAction = vi
        .fn()
        .mockResolvedValue({ error: false, message: "Success" });

      const { user } = render(
        <ActionButton action={mockAction} requireAreYouSure>
          Delete Item
        </ActionButton>,
      );

      const triggerButton = screen.getByRole("button", {
        name: /delete item/i,
      });
      await user.click(triggerButton);

      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("should execute action when confirmed in dialog", async () => {
      const mockAction = vi
        .fn()
        .mockResolvedValue({ error: false, message: "Deleted successfully" });

      const { user } = render(
        <ActionButton action={mockAction} requireAreYouSure>
          Remove
        </ActionButton>,
      );

      const triggerButton = screen.getByRole("button", { name: /remove/i });
      await user.click(triggerButton);

      const proceedButton = screen.getByRole("button", { name: /yes/i });
      await user.click(proceedButton);

      await waitFor(() => {
        expect(mockAction).toHaveBeenCalledTimes(1);
      });
    });

    it("should not execute action when cancelled in dialog", async () => {
      const mockAction = vi
        .fn()
        .mockResolvedValue({ error: false, message: "Success" });

      const { user } = render(
        <ActionButton action={mockAction} requireAreYouSure>
          Remove
        </ActionButton>,
      );

      const triggerButton = screen.getByRole("button", { name: /remove/i });
      await user.click(triggerButton);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(mockAction).not.toHaveBeenCalled();
      });
    });

    it("should disable proceed button while action is executing", async () => {
      const mockAction = vi
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () => resolve({ error: false, message: "Success" }),
                100,
              ),
            ),
        );

      const { user } = render(
        <ActionButton action={mockAction} requireAreYouSure>
          Delete
        </ActionButton>,
      );

      const triggerButton = screen.getByRole("button", { name: /delete/i });
      await user.click(triggerButton);

      const proceedButton = screen.getByRole("button", { name: /yes/i });
      await user.click(proceedButton);

      // Button should be disabled immediately after clicking
      expect(proceedButton).toBeDisabled();

      // Wait for action to complete
      await waitFor(() => {
        expect(mockAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  it("should pass through button props", () => {
    const mockAction = vi
      .fn()
      .mockResolvedValue({ error: false, message: "Success" });

    render(
      <ActionButton
        action={mockAction}
        variant="destructive"
        size="lg"
        className="custom-class"
      >
        Custom Button
      </ActionButton>,
    );

    const button = screen.getByRole("button", { name: /custom button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("custom-class");
  });

  it("should not allow multiple simultaneous action executions", async () => {
    const mockAction = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ error: false, message: "Success" }),
              100,
            ),
          ),
      );

    const { user } = render(
      <ActionButton action={mockAction}>Submit</ActionButton>,
    );

    const button = screen.getByRole("button", { name: /submit/i });

    await user.click(button);
    await user.click(button);
    await user.click(button);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
  });
});
