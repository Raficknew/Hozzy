import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { DialogTrigger } from "@/components/ui/dialog";
import { MemberAddDialog } from "@/features/members/components/MemberAddDialog";

describe("MemberAddDialog Integration Tests", () => {
  it("opens dialog and renders add member title", async () => {
    const { user } = render(
      <MemberAddDialog householdId="household-1">
        <DialogTrigger>Add member</DialogTrigger>
      </MemberAddDialog>,
    );

    const givenTrigger = screen.getByRole("button", { name: /add member/i });
    await user.click(givenTrigger);

    const thenDialogTitle = await screen.findByRole("heading", {
      name: /add member/i,
    });
    expect(thenDialogTitle).toBeInTheDocument();
  });
});
