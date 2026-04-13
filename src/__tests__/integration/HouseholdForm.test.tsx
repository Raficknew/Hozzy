import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import { updateHousehold } from "@/features/household/actions/household";
import { HouseholdForm } from "@/features/household/components/HouseholdGeneralForm";

vi.mock("@/features/household/actions/household", () => ({
  createHousehold: vi.fn(),
  updateHousehold: vi.fn(),
  joinHousehold: vi.fn(),
  generateLinkForHousehold: vi.fn(),
}));

vi.mock("@/global/functions", () => ({
  performFormSubmitAction: vi.fn(async (action: () => Promise<unknown>) => {
    const whenResult = await action();
    return whenResult;
  }),
}));

describe("HouseholdForm Integration Tests", () => {
  it("submits edited household data", async () => {
    const givenHousehold = {
      id: "household-1",
      name: "Smith House",
      description: "Original description",
      currencyCode: "USD",
      balance: 120,
    };

    const { user } = render(
      <HouseholdForm
        currencies={[{ code: "USD" }]}
        household={givenHousehold}
      />,
    );

    const givenNameInput = screen.getByLabelText(/name/i);
    await user.clear(givenNameInput);
    await user.type(givenNameInput, "Updated House");

    const givenSubmitButton = screen.getByRole("button", { name: /save/i });
    await user.click(givenSubmitButton);

    await waitFor(() => {
      expect(updateHousehold).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Updated House" }),
        "household-1",
      );
    });
  });
});
