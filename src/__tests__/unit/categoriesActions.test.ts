import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyServerActionDefaults } from "@/__tests__/mocks/unit-mocks";

type CategoriesActionsModule =
  typeof import("@/features/categories/actions/category");

let createCategory: CategoriesActionsModule["createCategory"];
let updateCategory: CategoriesActionsModule["updateCategory"];
let deleteCategory: CategoriesActionsModule["deleteCategory"];

const validCategoryInput = {
  name: "Food",
  icon: "wallet",
  categoryType: "fixed",
};

const mocks = vi.hoisted(() => {
  const headersMock = vi.fn();
  const getTranslationsMock = vi.fn();
  const revalidatePathMock = vi.fn();
  const redirectMock = vi.fn();
  const validateUuidMock = vi.fn();
  const getSessionMock = vi.fn();
  const safeParseMock = vi.fn();
  const assertCategoryCreateAbilityMock = vi.fn();
  const insertCategoryMock = vi.fn();
  const updateCategoryDBMock = vi.fn();
  const deleteCategoryDBMock = vi.fn();

  return {
    headersMock,
    getTranslationsMock,
    revalidatePathMock,
    redirectMock,
    validateUuidMock,
    getSessionMock,
    safeParseMock,
    assertCategoryCreateAbilityMock,
    insertCategoryMock,
    updateCategoryDBMock,
    deleteCategoryDBMock,
  };
});

vi.mock("next/headers", () => ({ headers: mocks.headersMock }));
vi.mock("next-intl/server", () => ({
  getTranslations: mocks.getTranslationsMock,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePathMock }));
vi.mock("uuid", () => ({ validate: mocks.validateUuidMock }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mocks.getSessionMock } },
}));
vi.mock("@/features/categories/schema/category", () => ({
  categorySchema: { safeParse: mocks.safeParseMock },
}));
vi.mock("@/features/categories/permissions/category", () => ({
  assertCategoryCreateAbility: mocks.assertCategoryCreateAbilityMock,
}));
vi.mock("@/features/categories/db/categories", () => ({
  insertCategory: mocks.insertCategoryMock,
  updateCategory: mocks.updateCategoryDBMock,
  deleteCategory: mocks.deleteCategoryDBMock,
}));

describe("categories actions", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyServerActionDefaults(mocks);
    mocks.safeParseMock.mockReturnValue({
      success: true,
      data: { name: "Food", icon: "wallet", categoryType: "fixed" },
    });

    ({ createCategory, updateCategory, deleteCategory } = await import(
      "@/features/categories/actions/category"
    ));
  });

  it("returns invalid user for createCategory when user is not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    const givenInput = validCategoryInput;
    const givenHouseholdId = "household-1";

    const whenCreatingCategory = createCategory(givenInput, givenHouseholdId);

    await expect(whenCreatingCategory).resolves.toEqual({
      error: true,
      message: "User.invalidId",
    });
  });

  it("creates category and revalidates settings path", async () => {
    const givenInput = validCategoryInput;
    const givenHouseholdId = "household-1";

    const whenCreatingCategory = createCategory(givenInput, givenHouseholdId);

    await expect(whenCreatingCategory).resolves.toEqual({
      error: false,
      message: "Categories.createSuccess",
    });

    expect(mocks.assertCategoryCreateAbilityMock).toHaveBeenCalledWith(
      "household-1",
    );
    expect(mocks.insertCategoryMock).toHaveBeenCalledWith({
      name: "Food",
      icon: "wallet",
      categoryType: "fixed",
      householdId: "household-1",
    });
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith(
      "/household-1/settings",
    );
  });

  it("returns updateError when updateCategory schema validation fails", async () => {
    mocks.safeParseMock.mockReturnValueOnce({ success: false });

    const givenInput = validCategoryInput;
    const givenCategoryId = "cat-1";
    const givenHouseholdId = "household-1";
    const givenType = "fixed";

    const whenUpdatingCategory = updateCategory(
      givenInput,
      givenCategoryId,
      givenHouseholdId,
      givenType,
    );

    await expect(whenUpdatingCategory).resolves.toEqual({
      error: true,
      message: "Categories.updateError",
    });

    expect(mocks.updateCategoryDBMock).not.toHaveBeenCalled();
  });

  it("returns deleteError when UUID validation fails", async () => {
    mocks.validateUuidMock.mockImplementationOnce(() => false);

    const givenCategoryId = "cat-1";
    const givenHouseholdId = "household-1";

    const whenDeletingCategory = deleteCategory(
      givenCategoryId,
      givenHouseholdId,
    );

    await expect(whenDeletingCategory).resolves.toEqual({
      error: true,
      message: "Categories.deleteError",
    });

    expect(mocks.deleteCategoryDBMock).not.toHaveBeenCalled();
  });

  it("deletes category and revalidates settings path", async () => {
    const givenCategoryId = "83bf65e8-d238-43a6-9c2d-209bee011e1e";
    const givenHouseholdId = "d36f1339-1e2a-4bb4-a11a-d1a5351b5452";

    const whenDeletingCategory = deleteCategory(
      givenCategoryId,
      givenHouseholdId,
    );

    await expect(whenDeletingCategory).resolves.toEqual({
      error: false,
      message: "Categories.deleteSuccess",
    });

    expect(mocks.deleteCategoryDBMock).toHaveBeenCalledWith(
      "83bf65e8-d238-43a6-9c2d-209bee011e1e",
      "d36f1339-1e2a-4bb4-a11a-d1a5351b5452",
    );
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith(
      "/d36f1339-1e2a-4bb4-a11a-d1a5351b5452/settings",
    );
  });
});
