import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import { generateLinkForHousehold } from "@/features/household/actions/household";
import { HouseholdLinkGenerate } from "@/features/household/components/HouseholdLinkGenerate";

vi.mock("@/features/household/actions/household", () => ({
  createHousehold: vi.fn(),
  updateHousehold: vi.fn(),
  joinHousehold: vi.fn(),
  generateLinkForHousehold: vi
    .fn()
    .mockResolvedValue({ error: false, message: "Updated" }),
}));

describe("HouseholdLinkGenerate Integration Tests", () => {
  it("renders copy link action in popover", async () => {
    const { user } = render(
      <HouseholdLinkGenerate
        householdId="household-1"
        url="https://app.test/join"
        link="abc123"
      />,
    );

    const givenOpenPopoverButton = screen.getByRole("button");
    await user.click(givenOpenPopoverButton);

    const givenCopyText = await screen.findByText(/click to copy/i);
    const givenCopyButton = givenCopyText.closest("button");
    expect(givenCopyButton).not.toBeNull();
    expect(
      screen.getByText("https://app.test/join/household-1/abc123"),
    ).toBeInTheDocument();
  });

  it("triggers link regeneration action", async () => {
    const { user } = render(
      <HouseholdLinkGenerate
        householdId="household-1"
        url="https://app.test/join"
        link="abc123"
      />,
    );

    const givenOpenPopoverButton = screen.getByRole("button");
    await user.click(givenOpenPopoverButton);

    const givenCopyText = await screen.findByText(/click to copy/i);
    const givenCopyButton = givenCopyText.closest("button");
    expect(givenCopyButton).not.toBeNull();
    const givenRefreshButton =
      givenCopyButton?.parentElement?.querySelector("button.size-9");
    expect(givenRefreshButton).not.toBeNull();
    if (!givenRefreshButton) {
      return;
    }
    await user.click(givenRefreshButton);

    await waitFor(() => {
      expect(generateLinkForHousehold).toHaveBeenCalledWith(
        "household-1",
        "abc123",
      );
    });
  });
});
