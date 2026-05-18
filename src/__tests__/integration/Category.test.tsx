import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { Category } from "@/features/categories/components/Category";

describe("Category Integration Tests", () => {
  it("renders category name and action controls", () => {
    const givenCategory = {
      id: "category-1",
      name: "Groceries",
      icon: "1_rent",
      categoryType: "fixed" as const,
    };

    render(<Category category={givenCategory} householdId="household-1" />);

    const thenCategoryName = screen.getByText("Groceries");
    expect(thenCategoryName).toBeInTheDocument();
    expect(
      screen.getByTestId("category-edit-btn-category-1"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("category-delete-btn-category-1"),
    ).toBeInTheDocument();
  });
});
