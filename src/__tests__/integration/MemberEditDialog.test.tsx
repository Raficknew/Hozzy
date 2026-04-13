import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { DialogTrigger } from "@/components/ui/dialog";
import { MemberEditDialog } from "@/features/members/components/MemberEditDialog";

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
      <MemberEditDialog householdId="household-1" member={givenMember}>
        <DialogTrigger>Edit member</DialogTrigger>
      </MemberEditDialog>,
    );

    const givenTrigger = screen.getByRole("button", { name: /edit member/i });
    await user.click(givenTrigger);

    const thenDialogTitle = await screen.findByText(/edit john/i);
    expect(thenDialogTitle).toBeInTheDocument();
  });
});
