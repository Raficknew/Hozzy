import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyCrudChainDefaults,
  applyDbOperatorDefaults,
} from "@/__tests__/mocks/unit-mocks";

type UsersDbModule = typeof import("@/features/users/db/users");

let updateUser: UsersDbModule["updateUser"];

const mocks = vi.hoisted(() => {
  const insertMock = vi.fn();
  const updateMock = vi.fn();
  const deleteMock = vi.fn();
  const valuesMock = vi.fn();
  const setMock = vi.fn();
  const whereMock = vi.fn();
  const returningMock = vi.fn();
  const eqMock = vi.fn();

  return {
    insertMock,
    updateMock,
    deleteMock,
    valuesMock,
    setMock,
    whereMock,
    returningMock,
    eqMock,
    dbMock: {
      insert: insertMock,
      update: updateMock,
      delete: deleteMock,
    },
  };
});

vi.mock("@/drizzle", () => ({ db: mocks.dbMock }));
vi.mock("drizzle-orm", () => ({ eq: mocks.eqMock }));
vi.mock("@/drizzle/schema/auth", () => ({
  user: {
    id: "userIdColumn",
  },
}));

describe("users db", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyDbOperatorDefaults({ eqMock: mocks.eqMock });
    applyCrudChainDefaults(
      {
        insertMock: mocks.insertMock,
        updateMock: mocks.updateMock,
        deleteMock: mocks.deleteMock,
        valuesMock: mocks.valuesMock,
        setMock: mocks.setMock,
        whereMock: mocks.whereMock,
        returningMock: mocks.returningMock,
      },
      [{ id: "user-1", name: "John" }],
    );

    ({ updateUser } = await import("@/features/users/db/users"));
  });

  it("updateUser returns updated user", async () => {
    const givenData = { name: "John" };
    const givenUserId = "user-1";

    const whenUpdatingUser = updateUser(givenData, givenUserId);

    await expect(whenUpdatingUser).resolves.toEqual({
      id: "user-1",
      name: "John",
    });

    expect(mocks.eqMock).toHaveBeenCalledWith("userIdColumn", "user-1");
  });

  it("updateUser throws when update result is null", async () => {
    const givenNullUpdateResult = [null];
    mocks.returningMock.mockResolvedValueOnce(givenNullUpdateResult);

    const givenData = { name: "John" };
    const givenUserId = "user-1";

    const whenUpdatingUser = updateUser(givenData, givenUserId);

    await expect(whenUpdatingUser).rejects.toThrow("Failed to update User");
  });
});
