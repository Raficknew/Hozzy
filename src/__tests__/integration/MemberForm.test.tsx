import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import { updateMember } from "@/features/members/actions/members";
import { MemberForm } from "@/features/members/components/MemberForm";

vi.mock("@/features/members/actions/members", () => ({
  createMember: vi.fn(),
  updateMember: vi.fn(),
  deleteMember: vi.fn(),
}));

vi.mock("@/global/functions", () => ({
  performFormSubmitAction: vi.fn(
    async (action: () => Promise<unknown>, onSuccess?: () => void) => {
      const whenResult = await action();
      onSuccess?.();
      return whenResult;
    },
  ),
}));

describe("MemberForm Integration Tests", () => {
  it("submits edited member data", async () => {
    const givenOnSuccess = vi.fn();

    const { user } = render(
      <MemberForm
        householdId="household-1"
        member={{ id: "member-1", name: "John" }}
        onSuccess={givenOnSuccess}
      />,
    );

    const givenNameInput = screen.getByPlaceholderText(/john/i);
    await user.clear(givenNameInput);
    await user.type(givenNameInput, "John Updated");

    const givenSubmitButton = screen.getByRole("button");
    await user.click(givenSubmitButton);

    await waitFor(() => {
      expect(updateMember).toHaveBeenCalledWith(
        { name: "John Updated" },
        "member-1",
        "household-1",
      );
      expect(givenOnSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
