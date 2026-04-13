import { beforeEach, describe, expect, it, vi } from "vitest";

let assertHouseholdCreateAbility: (userId: string) => Promise<void>;
let assertHouseholdWriteAccess: (
  householdId: string,
  userId?: string,
) => Promise<void>;
let canAccessHouseholdSettings: (householdId: string) => Promise<boolean>;

const VALID_HOUSEHOLD_ID = "83bf65e8-d238-43a6-9c2d-209bee011e1e";

const mocks = vi.hoisted(() => {
  const selectMock = vi.fn();
  const fromMock = vi.fn();
  const whereMock = vi.fn();
  const countMock = vi.fn();
  const eqMock = vi.fn();
  const andMock = vi.fn();
  const getSessionMock = vi.fn();
  const getHouseholdMock = vi.fn();
  const headersMock = vi.fn();
  const householdFindFirstMock = vi.fn();
  const membersFindFirstMock = vi.fn();

  return {
    selectMock,
    fromMock,
    whereMock,
    countMock,
    eqMock,
    andMock,
    getSessionMock,
    getHouseholdMock,
    headersMock,
    householdFindFirstMock,
    membersFindFirstMock,
    dbMock: {
      select: selectMock,
      query: {
        HouseholdTable: {
          findFirst: householdFindFirstMock,
        },
        MembersTable: {
          findFirst: membersFindFirstMock,
        },
      },
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
  and: mocks.andMock,
}));

vi.mock("@/drizzle/schema", () => ({
  HouseholdTable: {
    id: "householdId",
    ownerId: "ownerId",
  },
  MembersTable: {
    householdId: "membersHouseholdId",
    userId: "membersUserId",
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
    vi.clearAllMocks();

    mocks.selectMock.mockReturnValue({ from: mocks.fromMock });
    mocks.fromMock.mockReturnValue({ where: mocks.whereMock });
    mocks.whereMock.mockResolvedValue([{ count: 0 }]);
    mocks.countMock.mockReturnValue("count-function");
    mocks.eqMock.mockReturnValue("eq-condition");
    mocks.andMock.mockReturnValue("and-condition");

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
    vi.clearAllMocks();
    mocks.headersMock.mockResolvedValue({});
    mocks.eqMock.mockReturnValue("eq-condition");
    mocks.andMock.mockReturnValue("and-condition");
    mocks.householdFindFirstMock.mockResolvedValue({
      id: VALID_HOUSEHOLD_ID,
      ownerId: "user-123",
    });
    mocks.membersFindFirstMock.mockResolvedValue(null);

    ({ assertHouseholdWriteAccess } = await import(
      "@/features/household/permissions/household"
    ));
  });

  it("throws error when user is not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    await expect(assertHouseholdWriteAccess(VALID_HOUSEHOLD_ID)).rejects.toBe(
      "UserNotFound",
    );
  });

  it("throws error when household is not found", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.householdFindFirstMock.mockResolvedValueOnce(null);

    await expect(assertHouseholdWriteAccess(VALID_HOUSEHOLD_ID)).rejects.toBe(
      "HouseholdNotFound",
    );
  });

  it("allows access when user is the owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.householdFindFirstMock.mockResolvedValueOnce({
      id: VALID_HOUSEHOLD_ID,
      ownerId: "user-123",
    });

    await expect(
      assertHouseholdWriteAccess(VALID_HOUSEHOLD_ID),
    ).resolves.toBeUndefined();
  });

  it("allows access when user is a member", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-456" },
    });
    mocks.householdFindFirstMock.mockResolvedValueOnce({
      id: VALID_HOUSEHOLD_ID,
      ownerId: "user-123",
    });
    mocks.membersFindFirstMock.mockResolvedValueOnce({ id: "member-1" });

    await expect(
      assertHouseholdWriteAccess(VALID_HOUSEHOLD_ID),
    ).resolves.toBeUndefined();
  });

  it("throws error when user is neither owner nor member", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-999" },
    });
    mocks.householdFindFirstMock.mockResolvedValueOnce({
      id: VALID_HOUSEHOLD_ID,
      ownerId: "user-123",
    });
    mocks.membersFindFirstMock.mockResolvedValueOnce(null);

    await expect(assertHouseholdWriteAccess(VALID_HOUSEHOLD_ID)).rejects.toBe(
      "NotAllowedToWriteHouseholdException",
    );
  });

  it("throws error when household has no members and user is not owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-999" },
    });
    mocks.householdFindFirstMock.mockResolvedValueOnce({
      id: VALID_HOUSEHOLD_ID,
      ownerId: "user-123",
    });
    mocks.membersFindFirstMock.mockResolvedValueOnce(null);

    await expect(assertHouseholdWriteAccess(VALID_HOUSEHOLD_ID)).rejects.toBe(
      "NotAllowedToWriteHouseholdException",
    );
  });

  it("throws HouseholdNotFound when household id is invalid", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });

    await expect(assertHouseholdWriteAccess("household-123")).rejects.toBe(
      "HouseholdNotFound",
    );
  });
});

describe("canAccessHouseholdSettings", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
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

    const result = await canAccessHouseholdSettings(VALID_HOUSEHOLD_ID);

    expect(result).toBe(true);
  });

  it("returns false when user is not the owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-456" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
    });

    const result = await canAccessHouseholdSettings(VALID_HOUSEHOLD_ID);

    expect(result).toBe(false);
  });

  it("returns false when user is not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
    });

    const result = await canAccessHouseholdSettings(VALID_HOUSEHOLD_ID);

    expect(result).toBe(false);
  });

  it("returns false when household is not found", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce(null);

    const result = await canAccessHouseholdSettings(VALID_HOUSEHOLD_ID);

    expect(result).toBe(false);
  });
});
