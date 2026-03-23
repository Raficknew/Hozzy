import { beforeEach, describe, expect, it, vi } from "vitest";

let assertMemberWriteAccess: (householdId: string) => Promise<void>;
let checkIfUserCanCreateNewMember: (householdId: string) => Promise<boolean>;

const mocks = vi.hoisted(() => {
  const getSessionMock = vi.fn();
  const getHouseholdMock = vi.fn();
  const headersMock = vi.fn();

  return {
    getSessionMock,
    getHouseholdMock,
    headersMock,
    authMock: {
      api: {
        getSession: getSessionMock,
      },
    },
  };
});

vi.mock("@/lib/auth", () => ({
  auth: mocks.authMock,
}));

vi.mock("@/global/actions", () => ({
  getHousehold: mocks.getHouseholdMock,
}));

vi.mock("next/headers", () => ({
  headers: mocks.headersMock,
}));

vi.mock("@/global/limits", () => ({
  MAX_MEMBERS_PER_HOUSEHOLD: 8,
}));

describe("assertMemberWriteAccess", () => {
  beforeEach(async () => {
    vi.resetModules();
    mocks.headersMock.mockResolvedValue({});

    ({ assertMemberWriteAccess } = await import(
      "@/features/members/permissions/members"
    ));
  });

  it("allows access when user is the household owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
    });

    await expect(
      assertMemberWriteAccess("household-123"),
    ).resolves.toBeUndefined();
  });

  it("throws error when user is not the household owner", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-456" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
    });

    await expect(assertMemberWriteAccess("household-123")).rejects.toBe(
      "NotAllowedToWriteHouseholdException",
    );
  });

  it("throws error when user is not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);
    mocks.getHouseholdMock.mockResolvedValueOnce({
      ownerId: "user-123",
    });

    await expect(assertMemberWriteAccess("household-123")).rejects.toBe(
      "NotAllowedToWriteHouseholdException",
    );
  });

  it("throws error when household is not found", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-123" },
    });
    mocks.getHouseholdMock.mockResolvedValueOnce(null);

    await expect(assertMemberWriteAccess("household-123")).rejects.toBe(
      "NotAllowedToWriteHouseholdException",
    );
  });
});

describe("checkIfUserCanCreateNewMember", () => {
  beforeEach(async () => {
    vi.resetModules();

    ({ checkIfUserCanCreateNewMember } = await import(
      "@/features/members/permissions/members"
    ));
  });

  it("returns true when household has no members", async () => {
    mocks.getHouseholdMock.mockResolvedValueOnce({
      members: null,
    });

    const result = await checkIfUserCanCreateNewMember("household-123");

    expect(result).toBe(true);
  });

  it("returns true when household has undefined members", async () => {
    mocks.getHouseholdMock.mockResolvedValueOnce({
      members: undefined,
    });

    const result = await checkIfUserCanCreateNewMember("household-123");

    expect(result).toBe(true);
  });

  it("returns true when members count is under the limit", async () => {
    mocks.getHouseholdMock.mockResolvedValueOnce({
      members: [{ id: "1" }, { id: "2" }, { id: "3" }],
    });

    const result = await checkIfUserCanCreateNewMember("household-123");

    expect(result).toBe(true);
  });

  it("returns true when members count is at limit minus one", async () => {
    mocks.getHouseholdMock.mockResolvedValueOnce({
      members: Array(7).fill({ id: "member" }),
    });

    const result = await checkIfUserCanCreateNewMember("household-123");

    expect(result).toBe(true);
  });

  it("returns false when members count equals the limit", async () => {
    mocks.getHouseholdMock.mockResolvedValueOnce({
      members: Array(8).fill({ id: "member" }),
    });

    const result = await checkIfUserCanCreateNewMember("household-123");

    expect(result).toBe(false);
  });

  it("returns false when members count exceeds the limit", async () => {
    mocks.getHouseholdMock.mockResolvedValueOnce({
      members: Array(9).fill({ id: "member" }),
    });

    const result = await checkIfUserCanCreateNewMember("household-123");

    expect(result).toBe(false);
  });

  it("returns true when household has empty members array", async () => {
    mocks.getHouseholdMock.mockResolvedValueOnce({
      members: [],
    });

    const result = await checkIfUserCanCreateNewMember("household-123");

    expect(result).toBe(true);
  });

  it("returns true when household has one member", async () => {
    mocks.getHouseholdMock.mockResolvedValueOnce({
      members: [{ id: "1" }],
    });

    const result = await checkIfUserCanCreateNewMember("household-123");

    expect(result).toBe(true);
  });
});
