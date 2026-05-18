import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { DialogTrigger } from "@/components/ui/dialog";
import { MemberDialog } from "@/features/members/components/MemberDialog";

describe("MemberEditDialog Integration Tests", () => {
  it("opens dialog and renders member edit title", async () => {
    const givenMember = {
      id: "member-1",
      name: "John",
      user: {
        id: "user-1",
        image: null,
      },
    };

    const { user } = render(
      <MemberDialog
        householdId="household-1"
        member={givenMember}
        triggerTestId="member-edit-btn-member-1"
      >
        <DialogTrigger>Edit member</DialogTrigger>
      </MemberDialog>,
    );

    const givenTrigger = screen.getByTestId("member-edit-btn-member-1");
    await user.click(givenTrigger);

    const thenDialogTitle = await screen.findByText(/edit john/i);
    expect(thenDialogTitle).toBeInTheDocument();
  });
});
