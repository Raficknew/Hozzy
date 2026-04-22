import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import {
  createHousehold,
  updateHousehold,
} from "@/features/household/actions/household";
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
  describe("New Household Creation Form", () => {
    it("displays all required form fields for new household", () => {
      render(
        <HouseholdForm
          currencies={[
            { code: "USD" },
            { code: "EUR" },
            { code: "CHF" },
            { code: "PLN" },
          ]}
        />,
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByTestId("household-currency")).toBeInTheDocument();
      expect(screen.getByLabelText(/balance/i)).toBeInTheDocument();
      expect(screen.getByTestId("household-submit")).toBeInTheDocument();
    });

    it("fills and submits new household form with all fields", async () => {
      const { user } = render(
        <HouseholdForm
          currencies={[
            { code: "USD" },
            { code: "EUR" },
            { code: "CHF" },
            { code: "PLN" },
          ]}
        />,
      );

      const nameInput = screen.getByLabelText(/name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const balanceInput = screen.getByLabelText(/balance/i);
      const submitButton = screen.getByTestId("household-submit");

      await user.type(nameInput, "My Household");
      await user.type(descriptionInput, "Test Description");
      await user.click(screen.getByTestId("household-currency"));
      await user.click(screen.getByTestId("household-currency-option-usd"));
      await user.type(balanceInput, "1000");
      await user.click(submitButton);

      await waitFor(() => {
        expect(createHousehold).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "My Household",
            description: "Test Description",
            currencyCode: "USD",
            balance: 1000,
          }),
        );
      });
    });

    it("handles decimal values in balance field", async () => {
      const { user } = render(<HouseholdForm currencies={[{ code: "EUR" }]} />);

      const nameInput = screen.getByLabelText(/name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const balanceInput = screen.getByLabelText(/balance/i);
      const submitButton = screen.getByTestId("household-submit");

      await user.type(nameInput, "Decimal Household");
      await user.type(descriptionInput, "Testing decimals");
      await user.click(screen.getByTestId("household-currency"));
      await user.click(screen.getByTestId("household-currency-option-eur"));
      await user.type(balanceInput, "1234.56");
      await user.click(submitButton);

      await waitFor(() => {
        expect(createHousehold).toHaveBeenCalledWith(
          expect.objectContaining({
            balance: 1234.56,
          }),
        );
      });
    });

    it("submits form without optional balance field", async () => {
      const { user } = render(<HouseholdForm currencies={[{ code: "USD" }]} />);

      const nameInput = screen.getByLabelText(/name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByTestId("household-submit");

      await user.type(nameInput, "No Balance Household");
      await user.type(descriptionInput, "No balance provided");
      await user.click(screen.getByTestId("household-currency"));
      await user.click(screen.getByTestId("household-currency-option-usd"));
      await user.click(submitButton);

      await waitFor(() => {
        expect(createHousehold).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "No Balance Household",
            description: "No balance provided",
            currencyCode: "USD",
          }),
        );
      });
    });

    it("renders currency selector with available currencies", () => {
      render(
        <HouseholdForm
          currencies={[
            { code: "USD" },
            { code: "EUR" },
            { code: "CHF" },
            { code: "PLN" },
          ]}
        />,
      );

      const currencySelect = screen.getByRole("combobox");
      expect(currencySelect).toBeInTheDocument();
    });
  });

  describe("Existing Household Edit Form", () => {
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

    it("hides currency and balance fields when editing household", () => {
      const givenHousehold = {
        id: "household-1",
        name: "Existing House",
        description: "Description",
        currencyCode: "USD",
        balance: 100,
      };

      render(
        <HouseholdForm
          currencies={[{ code: "USD" }]}
          household={givenHousehold}
        />,
      );

      expect(screen.queryByLabelText(/currency/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/balance/i)).not.toBeInTheDocument();
    });

    it("shows save button for edit mode", () => {
      const givenHousehold = {
        id: "household-1",
        name: "Existing House",
        description: "Description",
        currencyCode: "USD",
        balance: 100,
      };

      render(
        <HouseholdForm
          currencies={[{ code: "USD" }]}
          household={givenHousehold}
        />,
      );

      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /create/i }),
      ).not.toBeInTheDocument();
    });
  });
});
