import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyDbOperatorDefaults } from "@/__tests__/mocks/unit-mocks";

type HouseholdDbModule = typeof import("@/features/household/db/household");

let insertHousehold: HouseholdDbModule["insertHousehold"];
let updateHousehold: HouseholdDbModule["updateHousehold"];
let deleteHousehold: HouseholdDbModule["deleteHousehold"];
let updateLink: HouseholdDbModule["updateLink"];

const mocks = vi.hoisted(() => {
  const insertMock = vi.fn();
  const updateMock = vi.fn();
  const deleteMock = vi.fn();

  const valuesMock = vi.fn();
  const returningMock = vi.fn();

  const setMock = vi.fn();
  const updateWhereMock = vi.fn();
  const updateReturningMock = vi.fn();
  const fromMock = vi.fn();

  const deleteWhereMock = vi.fn();
  const deleteReturningMock = vi.fn();

  const eqMock = vi.fn();
  const andMock = vi.fn();
  const headersMock = vi.fn();
  const getSessionMock = vi.fn();
  const getLocaleMock = vi.fn();
  const getTranslationsMock = vi.fn();
  const validateUuidMock = vi.fn();
  const assertHouseholdWriteAccessMock = vi.fn();
  const createUuidMock = vi.fn();

  const HouseholdTableMock = {
    id: "householdIdColumn",
    ownerId: "ownerIdColumn",
  };
  const MembersTableMock = { id: "memberIdColumn" };
  const InviteTableMock = {
    link: "inviteLinkColumn",
    householdId: "inviteHouseholdIdColumn",
  };
  const CategoryTableMock = { id: "categoryIdColumn" };
  const TransactionTableMock = { id: "transactionIdColumn" };

  return {
    insertMock,
    updateMock,
    deleteMock,
    valuesMock,
    returningMock,
    setMock,
    updateWhereMock,
    updateReturningMock,
    fromMock,
    deleteWhereMock,
    deleteReturningMock,
    eqMock,
    andMock,
    headersMock,
    getSessionMock,
    getLocaleMock,
    getTranslationsMock,
    validateUuidMock,
    assertHouseholdWriteAccessMock,
    createUuidMock,
    HouseholdTableMock,
    MembersTableMock,
    InviteTableMock,
    CategoryTableMock,
    TransactionTableMock,
    insertQueue: [] as unknown[],
    dbMock: {
      insert: insertMock,
      update: updateMock,
      delete: deleteMock,
    },
  };
});

vi.mock("@/drizzle", () => ({ db: mocks.dbMock }));
vi.mock("drizzle-orm", () => ({ eq: mocks.eqMock, and: mocks.andMock }));
vi.mock("next/headers", () => ({ headers: mocks.headersMock }));
vi.mock("next-intl/server", () => ({
  getLocale: mocks.getLocaleMock,
  getTranslations: mocks.getTranslationsMock,
}));
vi.mock("uuid", () => ({ validate: mocks.validateUuidMock }));
vi.mock("@/features/household/permissions/household", () => ({
  assertHouseholdWriteAccess: mocks.assertHouseholdWriteAccessMock,
}));
vi.mock("@/global/functions", () => ({ createUuid: mocks.createUuidMock }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mocks.getSessionMock } },
}));
vi.mock("@/drizzle/schema", () => ({
  HouseholdTable: mocks.HouseholdTableMock,
  MembersTable: mocks.MembersTableMock,
  InviteTable: mocks.InviteTableMock,
  CategoryTable: mocks.CategoryTableMock,
  TransactionTable: mocks.TransactionTableMock,
}));

describe("household db", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyDbOperatorDefaults(mocks);

    mocks.headersMock.mockResolvedValue({});
    mocks.getSessionMock.mockResolvedValue({
      user: { id: "user-1", name: "John" },
    });
    mocks.getLocaleMock.mockResolvedValue("en");
    mocks.getTranslationsMock.mockResolvedValue((key: string) => key);
    mocks.validateUuidMock.mockReturnValue(true);
    mocks.assertHouseholdWriteAccessMock.mockResolvedValue(undefined);
    mocks.createUuidMock.mockReturnValue("generated-link");

    mocks.insertQueue = [
      [{ id: "household-1", ownerId: "user-1" }],
      [{ id: "member-1" }],
      [{ id: "invite-1" }],
      [{ id: "category-income", categoryType: "incomes" }],
    ];

    mocks.insertMock.mockReturnValue({ values: mocks.valuesMock });
    mocks.valuesMock.mockImplementation((payload: unknown) => {
      if ((payload as { type?: string })?.type === "income") {
        return Promise.resolve({ id: "transaction-1" });
      }
      return { returning: mocks.returningMock };
    });
    mocks.returningMock.mockImplementation(async () =>
      mocks.insertQueue.shift(),
    );

    mocks.updateMock.mockReturnValue({ set: mocks.setMock });
    mocks.setMock.mockReturnValue({ where: mocks.updateWhereMock });
    mocks.updateWhereMock.mockReturnValue({
      returning: mocks.updateReturningMock,
      from: mocks.fromMock,
    });
    mocks.fromMock.mockReturnValue({ returning: mocks.updateReturningMock });
    mocks.updateReturningMock.mockResolvedValue([{ id: "updated-1" }]);

    mocks.deleteMock.mockReturnValue({ where: mocks.deleteWhereMock });
    mocks.deleteWhereMock.mockReturnValue({
      returning: mocks.deleteReturningMock,
    });
    mocks.deleteReturningMock.mockResolvedValue([{ id: "deleted-1" }]);

    ({ insertHousehold, updateHousehold, deleteHousehold, updateLink } =
      await import("@/features/household/db/household"));
  });

  it("insertHousehold throws when session is missing", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    const givenInput = {
      name: "home",
      description: "",
      currencyCode: "USD",
      ownerId: "user-1",
    };
    const givenBalance = 0;

    const whenInsertingHousehold = insertHousehold(givenInput, givenBalance);

    await expect(whenInsertingHousehold).rejects.toThrow(
      "Failed while createing Household",
    );
  });

  it("insertHousehold throws when default categories cannot be created", async () => {
    mocks.insertQueue = [
      [{ id: "household-1", ownerId: "user-1" }],
      [{ id: "member-1" }],
      [{ id: "invite-1" }],
      [],
    ];

    const givenInput = {
      name: "home",
      description: "",
      currencyCode: "USD",
      ownerId: "user-1",
    };
    const givenBalance = 0;

    const whenInsertingHousehold = insertHousehold(givenInput, givenBalance);

    await expect(whenInsertingHousehold).rejects.toThrow(
      "Failed to create category",
    );
  });

  it("insertHousehold returns created household on success", async () => {
    const givenInput = {
      name: "home",
      description: "",
      currencyCode: "USD",
      ownerId: "user-1",
    };
    const givenBalance = 0;

    const whenInsertingHousehold = insertHousehold(givenInput, givenBalance);

    await expect(whenInsertingHousehold).resolves.toEqual({
      id: "household-1",
      ownerId: "user-1",
    });

    expect(mocks.getTranslationsMock).toHaveBeenCalledWith("DefaultCategories");
    expect(mocks.createUuidMock).toHaveBeenCalled();
  });

  it("updateHousehold throws when householdId is invalid", async () => {
    mocks.validateUuidMock.mockReturnValueOnce(false);

    const givenData = {
      name: "new",
      description: "desc",
      currencyCode: "USD",
      balance: 10,
    };
    const givenHouseholdId = "invalid-id";

    const whenUpdatingHousehold = updateHousehold(givenData, givenHouseholdId);

    await expect(whenUpdatingHousehold).rejects.toThrow(
      "There was an error generateing new link",
    );
  });

  it("updateHousehold returns updated household", async () => {
    const givenData = {
      name: "new",
      description: "desc",
      currencyCode: "USD",
      balance: 10,
    };
    const givenHouseholdId = "83bf65e8-d238-43a6-9c2d-209bee011e1e";

    const whenUpdatingHousehold = updateHousehold(givenData, givenHouseholdId);

    await expect(whenUpdatingHousehold).resolves.toEqual({ id: "updated-1" });
  });

  it("deleteHousehold throws when delete returns null", async () => {
    const givenNullDeleteResult = [null];
    mocks.deleteReturningMock.mockResolvedValueOnce(givenNullDeleteResult);

    const givenHouseholdId = "83bf65e8-d238-43a6-9c2d-209bee011e1e";

    const whenDeletingHousehold = deleteHousehold(givenHouseholdId);

    await expect(whenDeletingHousehold).rejects.toThrow(
      "Failed to update your Household",
    );
  });

  it("updateLink returns updated invite link", async () => {
    const givenHouseholdId = "83bf65e8-d238-43a6-9c2d-209bee011e1e";
    const givenLink = "old-link";

    const whenUpdatingLink = updateLink(givenHouseholdId, givenLink);

    await expect(whenUpdatingLink).resolves.toEqual({ id: "updated-1" });

    expect(mocks.updateWhereMock).toHaveBeenCalled();
    expect(mocks.fromMock).toHaveBeenCalled();
  });
});
