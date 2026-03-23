import { beforeEach, describe, expect, it, vi } from "vitest";

let assertHouseholdCreateAbility: (userId: string) => Promise<void>;
let assertHouseholdWriteAccess: (householdId: string) => Promise<void>;
let canAccessHouseholdSettings: (householdId: string) => Promise<boolean>;

const mocks = vi.hoisted(() => {
  const selectMock = vi.fn();
  const fromMock = vi.fn();
  const whereMock = vi.fn();
  const countMock = vi.fn();
  const eqMock = vi.fn();
  const getSessionMock = vi.fn();
  const getHouseholdMock = vi.fn();
  const headersMock = vi.fn();

  return {
    selectMock,
    fromMock,
    whereMock,
    countMock,
    eqMock,
    getSessionMock,
    getHouseholdMock,
    headersMock,
    dbMock: {
      select: selectMock,
    },
    authMock: {
      api: {
        getSession: getSessionMock,
      },
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
  HouseholdTable: {
    ownerId: "ownerId",
  },
}));

vi.mock("@/global/limits", () => ({
  MAX_HOUSEHOLD_PER_USER: 3,
}));

vi.mock("@/lib/auth", () => ({
  auth: mocks.authMock,
}));

vi.mock("@/global/actions", () => ({
  getHousehold: mocks.getHouseholdMock,
}));

vi.mock("next/headers", () => ({
  headers: mocks.headersMock,
}));

describe("assertHouseholdCreateAbility", () => {
  beforeEach(async () => {
    vi.resetModules();

    mocks.selectMock.mockReturnValue({ from: mocks.fromMock });
    mocks.fromMock.mockReturnValue({ where: mocks.whereMock });
    mocks.whereMock.mockResolvedValue([{ count: 0 }]);
    mocks.countMock.mockReturnValue("count-function");
    mocks.eqMock.mockReturnValue("eq-condition");

    ({ assertHouseholdCreateAbility } = await import(
      "@/features/household/permissions/household"
    ));
  });

  it("throws error when userId is empty", async () => {
    await expect(assertHouseholdCreateAbility("")).rejects.toBe("UserNotFound");
  });

  it("allows household creation when under the limit", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 1 }]);

    await expect(
      assertHouseholdCreateAbility("user-123"),
    ).resolves.toBeUndefined();

    expect(mocks.selectMock).toHaveBeenCalledWith({ count: "count-function" });
    expect(mocks.eqMock).toHaveBeenCalledWith("ownerId", "user-123");
  });

  it("allows household creation when at limit minus one", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 2 }]);

    await expect(
      assertHouseholdCreateAbility("user-123"),
    ).resolves.toBeUndefined();
  });

  it("throws error when household limit is reached", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 3 }]);

    await expect(assertHouseholdCreateAbility("user-123")).rejects.toBe(
      "YouReachedALimitOfHouseholds",
    );
  });

  it("throws error when household limit is exceeded", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 4 }]);

    await expect(assertHouseholdCreateAbility("user-123")).rejects.toBe(
      "YouReachedALimitOfHouseholds",
    );
  });

  it("handles zero households correctly", async () => {
    mocks.whereMock.mockResolvedValueOnce([{ count: 0 }]);

    await expect(
      assertHouseholdCreateAbility("user-123"),
    ).resolves.toBeUndefined();
  });

  it("handles empty result array with default count", async () => {
    mocks.whereMock.mockResolvedValueOnce([]);

    await expect(
      assertHouseholdCreateAbility("user-123"),
    ).resolves.toBeUndefined();
  });
});

describe("assertHouseholdWriteAccess", () => {
  beforeEach(async () => {
    vi.resetModules();
    mocks.headersMock.mockResolvedValue({});

    ({ assertHouseholdWriteAccess } = await import(
      "@/features/household/permissions/household"
    ));
  });

  it("throws error when user is not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    await expect(assertHouseholdWriteAccess("household-123")).rejects.toBe(
      "UserNotFound",
    );
  });

  it("throws error when household is not found", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce(null);

    await expect(assertHouseholdWriteAccess("household-123")).rejects.toBe(
      "HouseholdNotFound",
    );
  });

  it("allows access when user is the owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
      members: [],
    });

    await expect(
      assertHouseholdWriteAccess("household-123"),
    ).resolves.toBeUndefined();
  });

  it("allows access when user is a member", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-456" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
      members: [{ userId: "user-456" }, { userId: "user-789" }],
    });

    await expect(
      assertHouseholdWriteAccess("household-123"),
    ).resolves.toBeUndefined();
  });

  it("throws error when user is neither owner nor member", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-999" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
      members: [{ userId: "user-456" }],
    });

    await expect(assertHouseholdWriteAccess("household-123")).rejects.toBe(
      "NotAllowedToWriteHouseholdException",
    );
  });

  it("throws error when household has no members and user is not owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-999" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
      members: [],
    });

    await expect(assertHouseholdWriteAccess("household-123")).rejects.toBe(
      "NotAllowedToWriteHouseholdException",
    );
  });
});

describe("canAccessHouseholdSettings", () => {
  beforeEach(async () => {
    vi.resetModules();
    mocks.headersMock.mockResolvedValue({});

    ({ canAccessHouseholdSettings } = await import(
      "@/features/household/permissions/household"
    ));
  });

  it("returns true when user is the owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
    });

    const result = await canAccessHouseholdSettings("household-123");

    expect(result).toBe(true);
  });

  it("returns false when user is not the owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-456" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
    });

    const result = await canAccessHouseholdSettings("household-123");

    expect(result).toBe(false);
  });

  it("returns false when user is not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
    });

    const result = await canAccessHouseholdSettings("household-123");

    expect(result).toBe(false);
  });

  it("returns false when household is not found", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce(null);

    const result = await canAccessHouseholdSettings("household-123");

    expect(result).toBe(false);
  });
});
