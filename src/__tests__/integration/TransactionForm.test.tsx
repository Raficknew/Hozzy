import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import { updateTransaction } from "@/features/transactions/actions/transactions";
import { TransactionForm } from "@/features/transactions/components/TransactionsForm";
import type { Category, Member, Transaction } from "@/global/types";

vi.mock("@/features/transactions/actions/transactions", () => ({
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
}));

vi.mock("@/global/functions", () => ({
  performFormSubmitAction: vi.fn(async (action: () => Promise<unknown>) => {
    const whenResult = await action();
    return whenResult;
  }),
}));

vi.mock("@/lib/auth-client", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: "user-1",
      },
    },
  })),
}));

describe("TransactionForm Integration Tests", () => {
  it("submits edited transaction data", async () => {
    const givenMembers: Member[] = [
      { id: "member-1", name: "John", user: { id: "user-1", image: null } },
    ];
    const givenCategories: Category[] = [
      { id: "category-1", name: "Rent", icon: "1_rent", categoryType: "fixed" },
    ];
    const givenTransaction: Transaction = {
      id: "transaction-1",
      categoryName: "Rent",
      categoryId: "category-1",
      name: "Old transaction",
      date: new Date("2026-01-01"),
      type: "expense",
      price: 10,
      memberId: "member-1",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };

    const { user } = render(
      <TransactionForm
        defaultTransactionType="expense"
        members={givenMembers}
        categories={givenCategories}
        householdId="household-1"
        transaction={givenTransaction}
      />,
    );

    const givenNameInput = screen.getByPlaceholderText(/gas/i);
    await user.clear(givenNameInput);
    await user.type(givenNameInput, "Updated transaction");

    const givenSaveButton = screen.getByRole("button", { name: /save/i });
    await user.click(givenSaveButton);

    await waitFor(() => {
      expect(updateTransaction).toHaveBeenCalledWith(
        "transaction-1",
        expect.objectContaining({
          name: "Updated transaction",
          type: "expense",
        }),
        "household-1",
      );
    });
  });
});
