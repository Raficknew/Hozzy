import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyServerActionDefaults } from "@/__tests__/mocks/unit-mocks";

type UsersActionsModule = typeof import("@/features/users/actions/users");

let updateUser: UsersActionsModule["updateUser"];

const validUserInput = {
  name: "John",
};

const mocks = vi.hoisted(() => {
  const headersMock = vi.fn();
  const getTranslationsMock = vi.fn();
  const revalidatePathMock = vi.fn();
  const redirectMock = vi.fn();
  const validateUuidMock = vi.fn();
  const getSessionMock = vi.fn();
  const safeParseMock = vi.fn();
  const updateUserDBMock = vi.fn();

  return {
    headersMock,
    getTranslationsMock,
    revalidatePathMock,
    redirectMock,
    validateUuidMock,
    getSessionMock,
    safeParseMock,
    updateUserDBMock,
  };
});

vi.mock("next/headers", () => ({ headers: mocks.headersMock }));
vi.mock("next-intl/server", () => ({
  getTranslations: mocks.getTranslationsMock,
}));
vi.mock("uuid", () => ({ validate: mocks.validateUuidMock }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mocks.getSessionMock } },
}));
vi.mock("@/features/users/schema/users", () => ({
  usersSchema: { safeParse: mocks.safeParseMock },
}));
vi.mock("@/features/users/db/users", () => ({
  updateUser: mocks.updateUserDBMock,
}));

describe("users actions", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyServerActionDefaults(mocks);
    mocks.safeParseMock.mockReturnValue({
      success: true,
      data: { name: "John" },
    });

    ({ updateUser } = await import("@/features/users/actions/users"));
  });

  it("returns invalid user when session is not available", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    const givenInput = validUserInput;
    const givenUserId = "user-id";

    const whenUpdatingUser = updateUser(givenInput, givenUserId);

    await expect(whenUpdatingUser).resolves.toEqual({
      error: true,
      message: "User.invalidId",
    });
  });

  it("returns updateError when users schema validation fails", async () => {
    mocks.safeParseMock.mockReturnValueOnce({ success: false });

    const givenInput = validUserInput;
    const givenUserId = "user-id";

    const whenUpdatingUser = updateUser(givenInput, givenUserId);

    await expect(whenUpdatingUser).resolves.toEqual({
      error: true,
      message: "User.updateError",
    });
  });

  it("returns invalid user when provided userId is not a uuid", async () => {
    mocks.validateUuidMock.mockReturnValueOnce(false);

    const givenInput = validUserInput;
    const givenUserId = "user-id";

    const whenUpdatingUser = updateUser(givenInput, givenUserId);

    await expect(whenUpdatingUser).resolves.toEqual({
      error: true,
      message: "User.invalidId",
    });
  });

  it("updates user when session, schema and uuid are valid", async () => {
    const givenInput = validUserInput;
    const givenUserId = "83bf65e8-d238-43a6-9c2d-209bee011e1e";

    const whenUpdatingUser = updateUser(givenInput, givenUserId);

    await expect(whenUpdatingUser).resolves.toEqual({
      error: false,
      message: "User.updateSuccess",
    });

    expect(mocks.updateUserDBMock).toHaveBeenCalledWith(
      { name: "John" },
      "83bf65e8-d238-43a6-9c2d-209bee011e1e",
    );
  });
});
