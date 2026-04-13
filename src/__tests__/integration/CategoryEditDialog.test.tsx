import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { DialogTrigger } from "@/components/ui/dialog";
import { CategoryEditDialog } from "@/features/categories/components/CategoryEditDialog";

describe("CategoryEditDialog Integration Tests", () => {
  it("opens dialog and renders category edit title", async () => {
    const givenCategory = {
      id: "category-1",
      name: "Groceries",
      icon: "1_rent",
      categoryType: "fixed" as const,
    };

    const { user } = render(
      <CategoryEditDialog householdId="household-1" category={givenCategory}>
        <DialogTrigger>Edit category</DialogTrigger>
      </CategoryEditDialog>,
    );

    const givenTrigger = screen.getByRole("button", { name: /edit category/i });
    await user.click(givenTrigger);

    const thenDialogTitle = await screen.findByText(/edit groceries/i);
    expect(thenDialogTitle).toBeInTheDocument();
  });
});
