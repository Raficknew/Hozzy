import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyCrudChainDefaults,
  applyDbOperatorDefaults,
} from "@/__tests__/mocks/unit-mocks";

type CategoriesDbModule = typeof import("@/features/categories/db/categories");
type CategoryDbInput = Parameters<CategoriesDbModule["insertCategory"]>[0];

let insertCategory: CategoriesDbModule["insertCategory"];
let updateCategory: CategoriesDbModule["updateCategory"];
let deleteCategory: CategoriesDbModule["deleteCategory"];

const validInsertInput: CategoryDbInput = {
  name: "Food",
  icon: "wallet",
  categoryType: "fixed",
  householdId: "household-1",
};

const validUpdateInput: CategoryDbInput = {
  id: "category-1",
  name: "Updated",
  icon: "wallet",
  categoryType: "fixed",
  householdId: "household-1",
};

const mocks = vi.hoisted(() => {
  const insertMock = vi.fn();
  const updateMock = vi.fn();
  const deleteMock = vi.fn();
  const valuesMock = vi.fn();
  const setMock = vi.fn();
  const whereMock = vi.fn();
  const returningMock = vi.fn();
  const eqMock = vi.fn();
  const andMock = vi.fn();

  return {
    insertMock,
    updateMock,
    deleteMock,
    valuesMock,
    setMock,
    whereMock,
    returningMock,
    eqMock,
    andMock,
    dbMock: {
      insert: insertMock,
      update: updateMock,
      delete: deleteMock,
    },
  };
});

vi.mock("@/drizzle", () => ({ db: mocks.dbMock }));
vi.mock("drizzle-orm", () => ({ eq: mocks.eqMock, and: mocks.andMock }));
vi.mock("@/drizzle/schema", () => ({
  CategoryTable: {
    id: "categoryIdColumn",
    householdId: "householdIdColumn",
  },
}));

describe("categories db", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyDbOperatorDefaults(mocks);
    applyCrudChainDefaults(mocks, [{ id: "category-1" }]);

    ({ insertCategory, updateCategory, deleteCategory } = await import(
      "@/features/categories/db/categories"
    ));
  });

  it("insertCategory returns created category", async () => {
    const givenInput = validInsertInput;

    const whenInsertingCategory = insertCategory(givenInput);

    await expect(whenInsertingCategory).resolves.toEqual({
      id: "category-1",
    });
  });

  it("insertCategory throws when insert returns null category", async () => {
    const givenNullInsertResult = [null];
    mocks.returningMock.mockResolvedValueOnce(givenNullInsertResult);

    const givenInput = validInsertInput;

    const whenInsertingCategory = insertCategory(givenInput);

    await expect(whenInsertingCategory).rejects.toThrow(
      "Failed to create Category",
    );
  });

  it("updateCategory returns updated category list", async () => {
    const givenInput = validUpdateInput;

    const whenUpdatingCategory = updateCategory(givenInput);

    await expect(whenUpdatingCategory).resolves.toEqual([{ id: "category-1" }]);

    expect(mocks.eqMock).toHaveBeenCalledWith("categoryIdColumn", "category-1");
  });

  it("updateCategory throws when returning result is null", async () => {
    const givenNullUpdateResult = null;
    mocks.returningMock.mockResolvedValueOnce(givenNullUpdateResult);

    const givenInput = validUpdateInput;

    const whenUpdatingCategory = updateCategory(givenInput);

    await expect(whenUpdatingCategory).rejects.toThrow(
      "Failed to update Category",
    );
  });

  it("deleteCategory throws when deleted category is null", async () => {
    const givenNullDeleteResult = [null];
    mocks.returningMock.mockResolvedValueOnce(givenNullDeleteResult);

    const givenCategoryId = "category-1";
    const givenHouseholdId = "household-1";

    const whenDeletingCategory = deleteCategory(
      givenCategoryId,
      givenHouseholdId,
    );

    await expect(whenDeletingCategory).rejects.toThrow(
      "Failed to delete Category",
    );

    expect(mocks.andMock).toHaveBeenCalled();
  });
});
