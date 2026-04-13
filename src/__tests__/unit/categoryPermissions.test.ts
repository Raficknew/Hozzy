import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyCategoryPermissionDefaults } from "@/__tests__/mocks/unit-mocks";

let assertCategoryCreateAbility: (householdId: string) => Promise<void>;

const mocks = vi.hoisted(() => {
  const selectMock = vi.fn();
  const fromMock = vi.fn();
  const whereMock = vi.fn();
  const countMock = vi.fn();
  const eqMock = vi.fn();

  return {
    selectMock,
    fromMock,
    whereMock,
    countMock,
    eqMock,
    dbMock: {
      select: selectMock,
    },
  };
});

vi.mock("@/drizzle", () => ({
  db: mocks.dbMock,
}));

vi.mock("drizzle-orm", () => ({
  count: mocks.countMock,
  eq: mocks.eqMock,
}));

vi.mock("@/drizzle/schema", () => ({
  CategoryTable: {
    householdId: "householdId",
  },
}));

vi.mock("@/global/limits", () => ({
  MAX_CATEGORIES_PER_HOUSEHOLD: 100,
}));

describe("assertCategoryCreateAbility", () => {
  beforeEach(async () => {
    vi.resetModules();

    applyCategoryPermissionDefaults(mocks);

    ({ assertCategoryCreateAbility } = await import(
      "@/features/categories/permissions/category"
    ));
  });

  it("throws error when householdId is empty", async () => {
    const givenHouseholdId = "";

    const whenAssertingCreateAbility =
      assertCategoryCreateAbility(givenHouseholdId);

    await expect(whenAssertingCreateAbility).rejects.toBe("HouseholdNotFound");
  });

  it("allows category creation when under the limit", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 50 }]);

    const givenHouseholdId = "household-123";

    const whenAssertingCreateAbility =
      assertCategoryCreateAbility(givenHouseholdId);

    await expect(whenAssertingCreateAbility).resolves.toBeUndefined();

    expect(mocks.selectMock).toHaveBeenCalledWith({ count: "count-function" });
    expect(mocks.eqMock).toHaveBeenCalledWith("householdId", "household-123");
  });

  it("allows category creation when at limit minus one", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 99 }]);

    const givenHouseholdId = "household-123";

    const whenAssertingCreateAbility =
      assertCategoryCreateAbility(givenHouseholdId);

    await expect(whenAssertingCreateAbility).resolves.toBeUndefined();
  });

  it("throws error when category limit is reached", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 100 }]);

    const givenHouseholdId = "household-123";

    const whenAssertingCreateAbility =
      assertCategoryCreateAbility(givenHouseholdId);

    await expect(whenAssertingCreateAbility).rejects.toBe(
      "YouReachedALimitOfCategories",
    );
  });

  it("throws error when category limit is exceeded", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 101 }]);

    const givenHouseholdId = "household-123";

    const whenAssertingCreateAbility =
      assertCategoryCreateAbility(givenHouseholdId);

    await expect(whenAssertingCreateAbility).rejects.toBe(
      "YouReachedALimitOfCategories",
    );
  });

  it("handles zero categories correctly", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 0 }]);

    const givenHouseholdId = "household-123";

    const whenAssertingCreateAbility =
      assertCategoryCreateAbility(givenHouseholdId);

    await expect(whenAssertingCreateAbility).resolves.toBeUndefined();
  });

  it("handles empty result array with default count", async () => {
    mocks.whereMock.mockResolvedValueOnce([]);

    const givenHouseholdId = "household-123";

    const whenAssertingCreateAbility =
      assertCategoryCreateAbility(givenHouseholdId);

    await expect(whenAssertingCreateAbility).resolves.toBeUndefined();
  });
});
