import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyServerActionDefaults } from "@/__tests__/mocks/unit-mocks";

type MembersActionsModule = typeof import("@/features/members/actions/members");

let createMember: MembersActionsModule["createMember"];
let deleteMember: MembersActionsModule["deleteMember"];
let updateMember: MembersActionsModule["updateMember"];

const validMemberInput = {
  name: "Mike",
};

const mocks = vi.hoisted(() => {
  const headersMock = vi.fn();
  const getTranslationsMock = vi.fn();
  const revalidatePathMock = vi.fn();
  const redirectMock = vi.fn();
  const validateUuidMock = vi.fn();
  const getSessionMock = vi.fn();
  const safeParseMock = vi.fn();
  const assertMemberWriteAccessMock = vi.fn();
  const checkIfUserCanCreateNewMemberMock = vi.fn();
  const insertMemberMock = vi.fn();
  const deleteMemberDBMock = vi.fn();
  const updateMemberDBMock = vi.fn();

  return {
    headersMock,
    getTranslationsMock,
    revalidatePathMock,
    redirectMock,
    validateUuidMock,
    getSessionMock,
    safeParseMock,
    assertMemberWriteAccessMock,
    checkIfUserCanCreateNewMemberMock,
    insertMemberMock,
    deleteMemberDBMock,
    updateMemberDBMock,
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
vi.mock("@/features/members/schema/members", () => ({
  membersSchema: { safeParse: mocks.safeParseMock },
}));
vi.mock("@/features/members/permissions/members", () => ({
  assertMemberWriteAccess: mocks.assertMemberWriteAccessMock,
  checkIfUserCanCreateNewMember: mocks.checkIfUserCanCreateNewMemberMock,
}));
vi.mock("@/features/members/db/members", () => ({
  insertMember: mocks.insertMemberMock,
  deleteMember: mocks.deleteMemberDBMock,
  updateMember: mocks.updateMemberDBMock,
}));

describe("members actions", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyServerActionDefaults(mocks);
    mocks.safeParseMock.mockReturnValue({
      success: true,
      data: { name: "Mike", userId: "user-2" },
    });
    mocks.checkIfUserCanCreateNewMemberMock.mockResolvedValue(true);

    ({ createMember, deleteMember, updateMember } = await import(
      "@/features/members/actions/members"
    ));
  });

  it("returns invalid user for createMember when user is not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    const givenInput = validMemberInput;
    const givenHouseholdId = "house-1";

    const whenCreatingMember = createMember(givenInput, givenHouseholdId);

    await expect(whenCreatingMember).resolves.toEqual({
      error: true,
      message: "User.invalidId",
    });
  });

  it("returns limit error when household member limit is reached", async () => {
    mocks.checkIfUserCanCreateNewMemberMock.mockResolvedValueOnce(false);

    const givenInput = validMemberInput;
    const givenHouseholdId = "house-1";

    const whenCreatingMember = createMember(givenInput, givenHouseholdId);

    await expect(whenCreatingMember).resolves.toEqual({
      error: true,
      message: "Limits.memberLimitReached",
    });
  });

  it("creates member and revalidates members path", async () => {
    const givenInput = validMemberInput;
    const givenHouseholdId = "house-1";

    const whenCreatingMember = createMember(givenInput, givenHouseholdId);

    await expect(whenCreatingMember).resolves.toEqual({
      error: false,
      message: "Members.createSuccess",
    });

    expect(mocks.assertMemberWriteAccessMock).toHaveBeenCalledWith("house-1");
    expect(mocks.insertMemberMock).toHaveBeenCalledWith(
      { name: "Mike", userId: "user-2" },
      "house-1",
    );
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith("/house-1/members");
  });

  it("returns deleteError for invalid UUIDs", async () => {
    mocks.validateUuidMock.mockImplementationOnce(() => false);

    const givenMemberId = "member-1";
    const givenHouseholdId = "house-1";

    const whenDeletingMember = deleteMember(givenMemberId, givenHouseholdId);

    await expect(whenDeletingMember).resolves.toEqual({
      error: true,
      message: "Members.deleteError",
    });

    expect(mocks.deleteMemberDBMock).not.toHaveBeenCalled();
  });

  it("deletes member and revalidates settings path", async () => {
    const givenMemberId = "83bf65e8-d238-43a6-9c2d-209bee011e1e";
    const givenHouseholdId = "d36f1339-1e2a-4bb4-a11a-d1a5351b5452";

    const whenDeletingMember = deleteMember(givenMemberId, givenHouseholdId);

    await expect(whenDeletingMember).resolves.toEqual({
      error: false,
      message: "Members.deleteSuccess",
    });

    expect(mocks.deleteMemberDBMock).toHaveBeenCalledWith(
      "83bf65e8-d238-43a6-9c2d-209bee011e1e",
      "d36f1339-1e2a-4bb4-a11a-d1a5351b5452",
    );
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith(
      "/d36f1339-1e2a-4bb4-a11a-d1a5351b5452/settings",
    );
  });

  it("updates member and revalidates members path", async () => {
    const givenInput = validMemberInput;
    const givenMemberId = "member-1";
    const givenHouseholdId = "house-1";

    const whenUpdatingMember = updateMember(
      givenInput,
      givenMemberId,
      givenHouseholdId,
    );

    await expect(whenUpdatingMember).resolves.toEqual({
      error: false,
      message: "Members.updateSuccess",
    });

    expect(mocks.assertMemberWriteAccessMock).toHaveBeenCalledWith("house-1");
    expect(mocks.updateMemberDBMock).toHaveBeenCalledWith(
      { memberId: "member-1", name: "Mike" },
      "house-1",
    );
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith("/house-1/members");
  });
});
