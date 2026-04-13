import type { User } from "better-auth";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import { updateUser } from "@/features/users/actions/users";
import { UserForm } from "@/features/users/components/UserForm";

vi.mock("@/features/users/actions/users", () => ({
  updateUser: vi.fn(),
}));

vi.mock("@/global/functions", () => ({
  performFormSubmitAction: vi.fn(async (action: () => Promise<unknown>) => {
    const whenResult = await action();
    return whenResult;
  }),
}));

describe("UserForm Integration Tests", () => {
  it("submits updated user name", async () => {
    const givenUser: User = {
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { user } = render(<UserForm user={givenUser} />);

    const givenNameInput = screen.getByLabelText(/name/i);
    await user.clear(givenNameInput);
    await user.type(givenNameInput, "Alice Updated");

    const givenSaveButton = screen.getByRole("button", { name: /save/i });
    await user.click(givenSaveButton);

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(
        { name: "Alice Updated" },
        "user-1",
      );
    });
  });
});
