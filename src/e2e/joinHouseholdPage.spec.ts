import { test } from "@/playwright/fixtures";
import { createHouseholdAndGetInviteLink } from "./helpers/household";
import { JoinHouseholdPage } from "./pages/JoinHouseholdPage";

test("should redirect to household dashboard when invited user already belongs to household", async ({
  authenticatedUser,
}) => {
  const inviteLink = await createHouseholdAndGetInviteLink(
    authenticatedUser.page,
    {
      name: "Invited Existing",
      description: "Join flow test",
      currency: "USD",
      balance: 100,
    },
  );
  const joinHouseholdPage = new JoinHouseholdPage(authenticatedUser.page);

  await joinHouseholdPage.goToInviteLink(inviteLink);
  await joinHouseholdPage.expectRedirectToDashboard();
});

test("should allow authenticated user outside household to join via invite link", async ({
  authenticatedUser,
  secondAuthenticatedUser,
}) => {
  const inviteLink = await createHouseholdAndGetInviteLink(
    authenticatedUser.page,
    {
      name: "Invited New User",
      description: "Join flow test",
      currency: "USD",
      balance: 100,
    },
  );

  const joinHouseholdPage = new JoinHouseholdPage(secondAuthenticatedUser.page);

  await joinHouseholdPage.goToInviteLink(inviteLink);
  await joinHouseholdPage.expectJoinButtonVisible();

  await joinHouseholdPage.joinHousehold();

  await joinHouseholdPage.goToInviteLink(inviteLink);
  await joinHouseholdPage.expectRedirectToDashboard();
});

test("should redirect unauthenticated user from invite link to sign-in page", async ({
  authenticatedUser,
  page,
}) => {
  const inviteLink = await createHouseholdAndGetInviteLink(
    authenticatedUser.page,
    {
      name: "Invite Unauth",
      description: "Join flow test",
      currency: "USD",
      balance: 100,
    },
  );
  const joinHouseholdPage = new JoinHouseholdPage(page);

  await joinHouseholdPage.goToInviteLink(inviteLink);
  await joinHouseholdPage.expectRedirectToSignIn();
});
