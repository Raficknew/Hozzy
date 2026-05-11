import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyServerActionDefaults } from "@/__tests__/mocks/unit-mocks";

type HouseholdActionsModule =
  typeof import("@/features/household/actions/household");

let createHousehold: HouseholdActionsModule["createHousehold"];
let updateHousehold: HouseholdActionsModule["updateHousehold"];
let deleteHousehold: HouseholdActionsModule["deleteHousehold"];
let joinHousehold: HouseholdActionsModule["joinHousehold"];
let generateLinkForHousehold: HouseholdActionsModule["generateLinkForHousehold"];

const validHouseholdInput = {
  name: "home",
  description: "",
  currencyCode: "USD",
  balance: 10,
};

const mocks = vi.hoisted(() => {
  const headersMock = vi.fn();
  const getTranslationsMock = vi.fn();
  const revalidatePathMock = vi.fn();
  const redirectMock = vi.fn();
  const validateUuidMock = vi.fn();
  const getSessionMock = vi.fn();
  const safeParseMock = vi.fn();
  const assertHouseholdCreateAbilityMock = vi.fn();
  const insertHouseholdMock = vi.fn();
  const updateHouseholdDBMock = vi.fn();
  const deleteHouseholdDBMock = vi.fn();
  const updateLinkMock = vi.fn();
  const insertMemberMock = vi.fn();

  return {
    headersMock,
    getTranslationsMock,
    revalidatePathMock,
    redirectMock,
    validateUuidMock,
    getSessionMock,
    safeParseMock,
    assertHouseholdCreateAbilityMock,
    insertHouseholdMock,
    updateHouseholdDBMock,
    deleteHouseholdDBMock,
    updateLinkMock,
    insertMemberMock,
  };
});

vi.mock("next/headers", () => ({ headers: mocks.headersMock }));
vi.mock("next-intl/server", () => ({
  getTranslations: mocks.getTranslationsMock,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePathMock }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirectMock }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mocks.getSessionMock } },
}));
vi.mock("@/features/household/schema/household", () => ({
  householdSchema: { safeParse: mocks.safeParseMock },
}));
vi.mock("@/features/household/permissions/household", () => ({
  assertHouseholdCreateAbility: mocks.assertHouseholdCreateAbilityMock,
}));
vi.mock("@/features/household/db/household", () => ({
  insertHousehold: mocks.insertHouseholdMock,
  updateHousehold: mocks.updateHouseholdDBMock,
  deleteHousehold: mocks.deleteHouseholdDBMock,
  updateLink: mocks.updateLinkMock,
}));
vi.mock("@/features/members/db/members", () => ({
  insertMember: mocks.insertMemberMock,
}));

describe("household actions", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyServerActionDefaults(mocks, { user: { id: "user-1", name: "John" } });
    mocks.safeParseMock.mockReturnValue({
      success: true,
      data: {
        name: "home",
        description: "",
        currencyCode: "USD",
        balance: 10,
      },
    });
    mocks.insertHouseholdMock.mockResolvedValue({ id: "house-1" });

    ({
      createHousehold,
      updateHousehold,
      deleteHousehold,
      joinHousehold,
      generateLinkForHousehold,
    } = await import("@/features/household/actions/household"));
  });

  it("returns invalid user for createHousehold when not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    const givenInput = validHouseholdInput;

    const whenCreatingHousehold = createHousehold(givenInput);

    await expect(whenCreatingHousehold).resolves.toEqual({
      error: true,
      message: "User.invalidId",
    });
  });

  it("creates household and redirects to settings", async () => {
    const givenInput = validHouseholdInput;

    const whenCreatingHousehold = createHousehold(givenInput);

    await whenCreatingHousehold;

    expect(mocks.assertHouseholdCreateAbilityMock).toHaveBeenCalledWith(
      "user-1",
    );
    expect(mocks.insertHouseholdMock).toHaveBeenCalledWith(
      {
        name: "Home",
        description: null,
        currencyCode: "USD",
        balance: 10,
        ownerId: "user-1",
      },
      10,
    );
    expect(mocks.redirectMock).toHaveBeenCalledWith(
      "/house-1/settings/household",
    );
  });

  it("returns updateError when updateHousehold schema validation fails", async () => {
    mocks.safeParseMock.mockReturnValueOnce({ success: false });

    const givenInput = validHouseholdInput;
    const givenHouseholdId = "house-1";

    const whenUpdatingHousehold = updateHousehold(givenInput, givenHouseholdId);

    await expect(whenUpdatingHousehold).resolves.toEqual({
      error: true,
      message: "Household.updateError",
    });
  });

  it("updates household and revalidates household settings path", async () => {
    const givenInput = validHouseholdInput;
    const givenHouseholdId = "house-1";

    const whenUpdatingHousehold = updateHousehold(givenInput, givenHouseholdId);

    await expect(whenUpdatingHousehold).resolves.toEqual({
      error: false,
      message: "Household.updateSuccess",
    });

    expect(mocks.updateHouseholdDBMock).toHaveBeenCalled();
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith(
      "/house-1/settings/household",
    );
  });

  it("deletes household and redirects home", async () => {
    const givenHouseholdId = "house-1";

    const whenDeletingHousehold = deleteHousehold(givenHouseholdId);

    await whenDeletingHousehold;

    expect(mocks.deleteHouseholdDBMock).toHaveBeenCalledWith("house-1");
    expect(mocks.redirectMock).toHaveBeenCalledWith("/");
  });

  it("returns invalid user for joinHousehold when session user name is missing", async () => {
    mocks.getSessionMock.mockResolvedValueOnce({
      user: { id: "user-1", name: null },
    });

    const givenHouseholdId = "house-1";
    const givenUserId = "user-2";

    const whenJoiningHousehold = joinHousehold(givenHouseholdId, givenUserId);

    await expect(whenJoiningHousehold).resolves.toEqual({
      error: true,
      message: "User.invalidId",
    });
  });

  it("joins household and redirects to household page", async () => {
    const givenHouseholdId = "house-1";
    const givenUserId = "user-2";

    const whenJoiningHousehold = joinHousehold(givenHouseholdId, givenUserId);

    await whenJoiningHousehold;

    expect(mocks.insertMemberMock).toHaveBeenCalledWith(
      { userId: "user-2", name: "John" },
      "house-1",
    );
    expect(mocks.redirectMock).toHaveBeenCalledWith("/house-1");
  });

  it("updates invite link and revalidates settings page", async () => {
    const givenHouseholdId = "house-1";
    const givenLink = "invite-link";

    const whenUpdatingLink = generateLinkForHousehold(
      givenHouseholdId,
      givenLink,
    );

    await expect(whenUpdatingLink).resolves.toEqual({
      error: false,
      message: "Household.linkUpdated",
    });

    expect(mocks.updateLinkMock).toHaveBeenCalledWith("house-1", "invite-link");
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith(
      "/house-1/settings/household",
    );
  });
});
