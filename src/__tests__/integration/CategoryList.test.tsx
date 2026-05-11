import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { CategoryList } from "@/features/categories/components/CategoryList";

describe("CategoryList Integration Tests", () => {
  it("switches active category tab and renders matching categories", async () => {
    const givenCategories = [
      {
        id: "category-fixed",
        name: "Rent",
        icon: "1_rent",
        categoryType: "fixed" as const,
      },
      {
        id: "category-fun",
        name: "Movies",
        icon: "1_rent",
        categoryType: "fun" as const,
      },
    ];

    const { user } = render(
      <CategoryList categories={givenCategories} householdId="household-1" />,
    );

    const thenFixedCategory = screen.getByText("Rent");
    expect(thenFixedCategory).toBeInTheDocument();

    const givenFunTab = screen.getByRole("button", { name: /fun/i });
    await user.click(givenFunTab);

    const thenFunCategory = await screen.findByText("Movies");
    expect(thenFunCategory).toBeInTheDocument();
  });
});
