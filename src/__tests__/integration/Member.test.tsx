import { describe, expect, it } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { Member } from "@/features/members/components/Member";

describe("Member Integration Tests", () => {
  it("renders member details and available controls", () => {
    const givenMember = {
      id: "member-1",
      name: "John",
      user: {
        id: "user-2",
        image: null,
      },
    };

    const { container } = render(
      <Member
        member={givenMember}
        householdId="household-1"
        ownerId="owner-1"
      />,
    );

    const thenMemberName = screen.getByText("John");
    expect(thenMemberName).toBeInTheDocument();
    expect(container.querySelector("button")).not.toBeNull();
  });
});
