import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import { joinHousehold } from "@/features/household/actions/household";
import { HouseholdJoinButton } from "@/features/household/components/HouseholdJoinButton";

vi.mock("@/features/household/actions/household", () => ({
  createHousehold: vi.fn(),
  updateHousehold: vi.fn(),
  joinHousehold: vi.fn().mockResolvedValue({ error: false, message: "Joined" }),
  generateLinkForHousehold: vi.fn(),
}));

describe("HouseholdJoinButton Integration Tests", () => {
  it("triggers household join action", async () => {
    const { user } = render(
      <HouseholdJoinButton
        householdId="household-1"
        userId="user-1"
        title="Join"
      />,
    );

    const givenJoinButton = screen.getByRole("button", { name: /join/i });
    await user.click(givenJoinButton);

    await waitFor(() => {
      expect(joinHousehold).toHaveBeenCalledWith("household-1", "user-1");
    });
  });
});
