import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import {
  createCategory,
  updateCategory,
} from "@/features/categories/actions/category";
import { CategoryForm } from "@/features/categories/components/CategoryForm";

vi.mock("@/features/categories/actions/category", () => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
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

describe("CategoryForm Integration Tests", () => {
  it("submits updated category values", async () => {
    const givenOnSuccess = vi.fn();
    const givenCategory = {
      id: "category-1",
      name: "Old Name",
      icon: "1_rent",
      categoryType: "fixed" as const,
    };

    const { user } = render(
      <CategoryForm
        householdId="household-1"
        category={givenCategory}
        categoryType="fixed"
        onSuccess={givenOnSuccess}
      />,
    );

    const givenNameInput = screen.getByPlaceholderText(/groceries/i);
    await user.clear(givenNameInput);
    await user.type(givenNameInput, "Updated Category");

    const givenSubmitButton = screen.getByRole("button", { name: /save/i });
    await user.click(givenSubmitButton);

    await waitFor(() => {
      expect(updateCategory).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Updated Category" }),
        "category-1",
        "household-1",
        "fixed",
      );
      expect(givenOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("submits created category values", async () => {
    const { user, container } = render(
      <CategoryForm householdId="household-1" categoryType="fixed" />,
    );

    const givenNameInput = screen.getByPlaceholderText(/groceries/i);
    await user.type(givenNameInput, "New Category");

    const givenIconButton = container.querySelector("button.rounded-lg");
    expect(givenIconButton).not.toBeNull();
    if (!givenIconButton) {
      return;
    }
    await user.click(givenIconButton);

    const givenSubmitButton = screen.getByRole("button", { name: /add/i });
    await user.click(givenSubmitButton);

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith(
        expect.objectContaining({ name: "New Category" }),
        "household-1",
      );
    });
  });
});
