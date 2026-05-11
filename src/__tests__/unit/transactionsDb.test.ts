import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyCrudChainDefaults,
  applyDbOperatorDefaults,
} from "@/__tests__/mocks/unit-mocks";

type TransactionsDbModule =
  typeof import("@/features/transactions/db/transactions");
type TransactionDbInput = Parameters<
  TransactionsDbModule["insertTransaction"]
>[0];

let insertTransaction: TransactionsDbModule["insertTransaction"];
let updateTransaction: TransactionsDbModule["updateTransaction"];
let deleteTransaction: TransactionsDbModule["deleteTransaction"];

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
vi.mock("@/drizzle/schema", () => ({
  TransactionTable: {
    id: "transactionIdColumn",
  },
}));

describe("transactions db", () => {
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
      [{ id: "transaction-1" }],
    );

    ({ insertTransaction, updateTransaction, deleteTransaction } = await import(
      "@/features/transactions/db/transactions"
    ));
  });

  const validInput: TransactionDbInput = {
    id: "transaction-1",
    name: "Salary",
    categoryId: "category-1",
    date: new Date("2026-04-13T00:00:00.000Z"),
    price: 100,
    type: "income",
    memberId: "member-1",
  };

  it("insertTransaction returns created transaction", async () => {
    const givenInput = validInput;

    const whenInsertingTransaction = insertTransaction(givenInput);

    await expect(whenInsertingTransaction).resolves.toEqual({
      id: "transaction-1",
    });
  });

  it("insertTransaction throws when insert result is null", async () => {
    const givenNullInsertResult = [null];
    mocks.returningMock.mockResolvedValueOnce(givenNullInsertResult);

    const givenInput = validInput;

    const whenInsertingTransaction = insertTransaction(givenInput);

    await expect(whenInsertingTransaction).rejects.toThrow(
      "Failed to create Transaction",
    );
  });

  it("updateTransaction returns updated transaction", async () => {
    const givenInput = validInput;

    const whenUpdatingTransaction = updateTransaction(givenInput);

    await expect(whenUpdatingTransaction).resolves.toEqual({
      id: "transaction-1",
    });

    expect(mocks.eqMock).toHaveBeenCalledWith(
      "transactionIdColumn",
      "transaction-1",
    );
  });

  it("updateTransaction throws when update result is null", async () => {
    const givenNullUpdateResult = [null];
    mocks.returningMock.mockResolvedValueOnce(givenNullUpdateResult);

    const givenInput = validInput;

    const whenUpdatingTransaction = updateTransaction(givenInput);

    await expect(whenUpdatingTransaction).rejects.toThrow(
      "Failed to update Transaction",
    );
  });

  it("deleteTransaction throws when delete result is null", async () => {
    const givenNullDeleteResult = [null];
    mocks.returningMock.mockResolvedValueOnce(givenNullDeleteResult);

    const givenTransactionId = "transaction-1";

    const whenDeletingTransaction = deleteTransaction(givenTransactionId);

    await expect(whenDeletingTransaction).rejects.toThrow(
      "Failed to delete Transaction",
    );
  });
});
