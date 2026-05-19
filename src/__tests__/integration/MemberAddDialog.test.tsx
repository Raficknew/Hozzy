import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { DialogTrigger } from "@/components/ui/dialog";
import { MemberDialog } from "@/features/members/components/MemberDialog";

describe("MemberAddDialog Integration Tests", () => {
  it("opens dialog and renders add member title", async () => {
    const { user } = render(
      <MemberDialog householdId="household-1" triggerTestId="member-add-btn">
        <DialogTrigger>Add member</DialogTrigger>
      </MemberDialog>,
    );

    const givenTrigger = screen.getByTestId("member-add-btn");
    await user.click(givenTrigger);

    const thenDialogTitle = await screen.findByRole("heading", {
      name: /add member/i,
    });
    expect(thenDialogTitle).toBeInTheDocument();
  });
});
