import { beforeEach, describe, expect, it, vi } from "vitest";

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

    mocks.selectMock.mockReturnValue({ from: mocks.fromMock });
    mocks.fromMock.mockReturnValue({ where: mocks.whereMock });
    mocks.whereMock.mockResolvedValue([{ count: 0 }]);
    mocks.countMock.mockReturnValue("count-function");
    mocks.eqMock.mockReturnValue("eq-condition");

    ({ assertCategoryCreateAbility } = await import(
      "@/features/categories/permissions/category"
    ));
  });

  it("throws error when householdId is empty", async () => {
    await expect(assertCategoryCreateAbility("")).rejects.toBe(
      "HouseholdNotFound",
    );
  });

  it("allows category creation when under the limit", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 50 }]);

    await expect(
      assertCategoryCreateAbility("household-123"),
    ).resolves.toBeUndefined();

    expect(mocks.selectMock).toHaveBeenCalledWith({ count: "count-function" });
    expect(mocks.eqMock).toHaveBeenCalledWith("householdId", "household-123");
  });

  it("allows category creation when at limit minus one", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 99 }]);

    await expect(
      assertCategoryCreateAbility("household-123"),
    ).resolves.toBeUndefined();
  });

  it("throws error when category limit is reached", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 100 }]);

    await expect(assertCategoryCreateAbility("household-123")).rejects.toBe(
      "YouReachedALimitOfCategories",
    );
  });

  it("throws error when category limit is exceeded", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 101 }]);

    await expect(assertCategoryCreateAbility("household-123")).rejects.toBe(
      "YouReachedALimitOfCategories",
    );
  });

  it("handles zero categories correctly", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 0 }]);

    await expect(
      assertCategoryCreateAbility("household-123"),
    ).resolves.toBeUndefined();
  });

  it("handles empty result array with default count", async () => {
    mocks.whereMock.mockResolvedValueOnce([]);

    await expect(
      assertCategoryCreateAbility("household-123"),
    ).resolves.toBeUndefined();
  });
});
