import { test } from "@/playwright/fixtures";
import {
  createHouseholdAndGetInviteLink,
  createHouseholdFromHome,
  householdInviteLinkUrlPattern,
} from "./helpers/household";
import { DashboardPage } from "./pages/DashboardPage";
import { SettingsPage } from "./pages/SettingsPage";

test("should be able to navigate between account, categories and household settings", async ({
  authenticatedUser,
}) => {
  await createHouseholdFromHome(authenticatedUser.page, {
    name: "Settings E2E",
    description: "Settings flow test",
    currency: "USD",
    balance: 100,
  });

  const dashboardPage = new DashboardPage(authenticatedUser.page);
  await dashboardPage.goToDashboard();
  await dashboardPage.goToSettings();

  const settingsPage = new SettingsPage(authenticatedUser.page);

  await settingsPage.goToCategoriesSettings();
  await settingsPage.goToHouseholdSettings();
  await settingsPage.goToAccountSettings();
});

test("should be able to copy and regenerate household invite link", async ({
  authenticatedUser,
}) => {
  const initialLinkText = await createHouseholdAndGetInviteLink(
    authenticatedUser.page,
    {
      name: "Invite Link E2E",
      description: "Invite link flow",
      currency: "USD",
      balance: 500,
    },
  );

  const settingsPage = new SettingsPage(authenticatedUser.page);

  await settingsPage.copyInviteLink();
  await settingsPage.regenerateInviteLink();
  await settingsPage.expectInviteLinkTextChanged(initialLinkText);
  await settingsPage.expectInviteLinkTextMatches(householdInviteLinkUrlPattern);
});
