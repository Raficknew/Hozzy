import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyServerActionDefaults } from "@/__tests__/mocks/unit-mocks";

type TransactionsActionsModule =
  typeof import("@/features/transactions/actions/transactions");

let createTransaction: TransactionsActionsModule["createTransaction"];
let updateTransaction: TransactionsActionsModule["updateTransaction"];
let deleteTransaction: TransactionsActionsModule["deleteTransaction"];

const validTransactionInput = {
  name: "Salary",
  categoryId: "cat-1",
  date: new Date("2026-04-13T00:00:00.000Z"),
  price: 100,
  type: "income",
  memberId: "member-1",
};

const mocks = vi.hoisted(() => {
  const headersMock = vi.fn();
  const getTranslationsMock = vi.fn();
  const revalidatePathMock = vi.fn();
  const redirectMock = vi.fn();
  const validateUuidMock = vi.fn();
  const getSessionMock = vi.fn();
  const safeParseMock = vi.fn();
  const assertTransactionsRateLimitMock = vi.fn();
  const assertHouseholdWriteAccessMock = vi.fn();
  const insertTransactionMock = vi.fn();
  const updateTransactionDBMock = vi.fn();
  const deleteTransactionDBMock = vi.fn();

  return {
    headersMock,
    getTranslationsMock,
    revalidatePathMock,
    redirectMock,
    validateUuidMock,
    getSessionMock,
    safeParseMock,
    assertTransactionsRateLimitMock,
    assertHouseholdWriteAccessMock,
    insertTransactionMock,
    updateTransactionDBMock,
    deleteTransactionDBMock,
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
vi.mock("@/features/transactions/schema/transactions", () => ({
  transactionsSchema: { safeParse: mocks.safeParseMock },
}));
vi.mock("@/global/ratelimit", () => ({
  assertTransactionsRateLimit: mocks.assertTransactionsRateLimitMock,
}));
vi.mock("@/features/household/permissions/household", () => ({
  assertHouseholdWriteAccess: mocks.assertHouseholdWriteAccessMock,
}));
vi.mock("@/features/transactions/db/transactions", () => ({
  insertTransaction: mocks.insertTransactionMock,
  updateTransaction: mocks.updateTransactionDBMock,
  deleteTransaction: mocks.deleteTransactionDBMock,
}));

describe("transactions actions", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    applyServerActionDefaults(mocks);
    mocks.safeParseMock.mockReturnValue({
      success: true,
      data: {
        name: "Salary",
        categoryId: "cat-1",
        date: new Date("2026-04-13T00:00:00.000Z"),
        price: 100,
        type: "income",
        memberId: "member-1",
      },
    });

    ({ createTransaction, updateTransaction, deleteTransaction } = await import(
      "@/features/transactions/actions/transactions"
    ));
  });

  it("returns invalid user for createTransaction when user is not authenticated", async () => {
    mocks.getSessionMock.mockResolvedValueOnce(null);

    const givenInput = validTransactionInput;
    const givenHouseholdId = "house-1";

    const whenCreatingTransaction = createTransaction(
      givenInput,
      givenHouseholdId,
    );

    await expect(whenCreatingTransaction).resolves.toEqual({
      error: true,
      message: "User.invalidId",
    });
  });

  it("creates transaction and revalidates related paths", async () => {
    const givenInput = validTransactionInput;
    const givenHouseholdId = "house-1";

    const whenCreatingTransaction = createTransaction(
      givenInput,
      givenHouseholdId,
    );

    await expect(whenCreatingTransaction).resolves.toEqual({
      error: false,
      message: "Transactions.createSuccess",
    });

    expect(mocks.assertTransactionsRateLimitMock).toHaveBeenCalledWith(
      "user-1",
    );
    expect(mocks.assertHouseholdWriteAccessMock).toHaveBeenCalledWith(
      "house-1",
      "user-1",
    );
    expect(mocks.insertTransactionMock).toHaveBeenCalledWith({
      name: "Salary",
      categoryId: "cat-1",
      date: new Date("2026-04-13T00:00:00.000Z"),
      price: 100,
      type: "income",
      memberId: "member-1",
    });
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith("/house-1");
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith(
      "/house-1/transactions",
    );
  });

  it("returns updateError when updateTransaction schema validation fails", async () => {
    mocks.safeParseMock.mockReturnValueOnce({ success: false });

    const givenTransactionId = "tx-1";
    const givenInput = validTransactionInput;
    const givenHouseholdId = "house-1";

    const whenUpdatingTransaction = updateTransaction(
      givenTransactionId,
      givenInput,
      givenHouseholdId,
    );

    await expect(whenUpdatingTransaction).resolves.toEqual({
      error: true,
      message: "Transactions.updateError",
    });
  });

  it("returns deleteError when transaction id is invalid", async () => {
    mocks.validateUuidMock.mockReturnValueOnce(false);

    const givenTransactionId = "tx-1";
    const givenHouseholdId = "house-1";

    const whenDeletingTransaction = deleteTransaction(
      givenTransactionId,
      givenHouseholdId,
    );

    await expect(whenDeletingTransaction).resolves.toEqual({
      error: true,
      message: "Transactions.deleteError",
    });

    expect(mocks.deleteTransactionDBMock).not.toHaveBeenCalled();
  });

  it("deletes transaction and revalidates related paths", async () => {
    const givenTransactionId = "83bf65e8-d238-43a6-9c2d-209bee011e1e";
    const givenHouseholdId = "house-1";

    const whenDeletingTransaction = deleteTransaction(
      givenTransactionId,
      givenHouseholdId,
    );

    await expect(whenDeletingTransaction).resolves.toEqual({
      error: false,
      message: "Transactions.deleteSuccess",
    });

    expect(mocks.deleteTransactionDBMock).toHaveBeenCalledWith(
      "83bf65e8-d238-43a6-9c2d-209bee011e1e",
    );
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith("/house-1");
    expect(mocks.revalidatePathMock).toHaveBeenCalledWith(
      "/house-1/transactions",
    );
  });
});
