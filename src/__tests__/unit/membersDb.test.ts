import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyCrudChainDefaults,
  applyDbOperatorDefaults,
} from "@/__tests__/mocks/unit-mocks";

type MembersDbModule = typeof import("@/features/members/db/members");

let insertMember: MembersDbModule["insertMember"];
let deleteMember: MembersDbModule["deleteMember"];
let updateMember: MembersDbModule["updateMember"];

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
  MembersTable: {
    id: "memberIdColumn",
    householdId: "householdIdColumn",
  },
}));

describe("members db", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyDbOperatorDefaults(mocks);
    applyCrudChainDefaults(mocks, [{ id: "member-1" }]);

    ({ insertMember, deleteMember, updateMember } = await import(
      "@/features/members/db/members"
    ));
  });

  it("insertMember returns created member", async () => {
    const givenMember = { userId: "user-1", name: "John" };
    const givenHouseholdId = "household-1";

    const whenInsertingMember = insertMember(givenMember, givenHouseholdId);

    await expect(whenInsertingMember).resolves.toEqual({ id: "member-1" });
  });

  it("insertMember normalizes undefined userId to null", async () => {
    const givenMember = { name: "John" };
    const givenHouseholdId = "household-1";

    const whenInsertingMember = insertMember(givenMember, givenHouseholdId);

    await whenInsertingMember;

    expect(mocks.valuesMock).toHaveBeenCalledWith({
      householdId: "household-1",
      userId: null,
      name: "John",
    });
  });

  it("deleteMember throws when deleted member is null", async () => {
    const givenNullDeleteResult = [null];
    mocks.returningMock.mockResolvedValueOnce(givenNullDeleteResult);

    const givenMemberId = "member-1";
    const givenHouseholdId = "household-1";

    const whenDeletingMember = deleteMember(givenMemberId, givenHouseholdId);

    await expect(whenDeletingMember).rejects.toThrow("Failed to delete Member");
  });

  it("updateMember updates only name and returns member", async () => {
    const givenMember = { memberId: "member-1", name: "Anna" };
    const givenHouseholdId = "household-1";

    const whenUpdatingMember = updateMember(givenMember, givenHouseholdId);

    await expect(whenUpdatingMember).resolves.toEqual({ id: "member-1" });

    expect(mocks.setMock).toHaveBeenCalledWith({ name: "Anna" });
  });

  it("updateMember throws when updated member is null", async () => {
    const givenNullUpdateResult = [null];
    mocks.returningMock.mockResolvedValueOnce(givenNullUpdateResult);

    const givenMember = { memberId: "member-1", name: "Anna" };
    const givenHouseholdId = "household-1";

    const whenUpdatingMember = updateMember(givenMember, givenHouseholdId);

    await expect(whenUpdatingMember).rejects.toThrow("Failed to update Member");
  });
});
