import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { CategoryDialog } from "@/features/categories/components/CategoryDialog";

describe("CategoryDialog Integration Tests", () => {
  it("opens dialog and renders category edit title", async () => {
    const givenCategory = {
      id: "category-1",
      name: "Groceries",
      icon: "1_rent",
      categoryType: "fixed" as const,
    };

    const { user } = render(
      <CategoryDialog householdId="household-1" category={givenCategory} />,
    );

    const givenTrigger = screen.getByTestId("category-edit-btn-category-1");
    await user.click(givenTrigger);

    const thenDialogTitle = await screen.findByText(/edit/i);
    expect(thenDialogTitle).toBeInTheDocument();
  });
});
