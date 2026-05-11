import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { DialogTrigger } from "@/components/ui/dialog";
import { TransactionDialog } from "@/features/transactions/components/TransactionDialog";
import type { Category, Member } from "@/global/types";

vi.mock("@/lib/auth-client", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: "user-1",
      },
    },
  })),
}));

describe("TransactionDialog Integration Tests", () => {
  it("opens dialog and renders transaction form", async () => {
    const givenMembers: Member[] = [
      { id: "member-1", name: "John", user: { id: "user-1", image: null } },
    ];
    const givenCategories: Category[] = [
      { id: "category-1", name: "Rent", icon: "1_rent", categoryType: "fixed" },
    ];

    const { user } = render(
      <TransactionDialog
        defaultTransactionType="expense"
        householdId="household-1"
        categories={givenCategories}
        members={givenMembers}
      >
        <DialogTrigger>Open</DialogTrigger>
      </TransactionDialog>,
    );

    const givenTrigger = screen.getByRole("button", { name: /open/i });
    await user.click(givenTrigger);

    const thenNameInput = await screen.findByPlaceholderText(/gas/i);
    expect(thenNameInput).toBeInTheDocument();
  });
});
