import { expect, test } from "@/playwright/fixtures";
import {
  createHouseholdAndGetInviteLink,
  createHouseholdFromHome,
  householdAccountSettingsUrlPattern,
  householdCategoriesSettingsUrlPattern,
  householdDashboardUrlPattern,
  householdSettingsUrlPattern,
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
  await expect(authenticatedUser.page).toHaveURL(householdSettingsUrlPattern);

  const dashboardPage = new DashboardPage(authenticatedUser.page);
  await dashboardPage.goToDashboard();
  await expect(authenticatedUser.page).toHaveURL(householdDashboardUrlPattern);

  await dashboardPage.goToSettings();
  await expect(authenticatedUser.page).toHaveURL(
    householdAccountSettingsUrlPattern,
  );

  const settingsPage = new SettingsPage(authenticatedUser.page);

  await settingsPage.goToCategoriesSettings();
  await expect(authenticatedUser.page).toHaveURL(
    householdCategoriesSettingsUrlPattern,
  );

  await settingsPage.goToHouseholdSettings();
  await expect(authenticatedUser.page).toHaveURL(householdSettingsUrlPattern);

  await settingsPage.goToAccountSettings();
  await expect(authenticatedUser.page).toHaveURL(
    householdAccountSettingsUrlPattern,
  );
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

  await authenticatedUser.page.click("body", { position: { x: 0, y: 0 } });
  await authenticatedUser.page.waitForTimeout(200);

  await settingsPage.openInviteLinkPopover();
  await settingsPage.regenerateInviteLink();

  await authenticatedUser.page.waitForTimeout(200);

  await settingsPage.openInviteLinkPopover();
  const newLinkText = await settingsPage.getInviteLinkText();

  expect(newLinkText).toBeTruthy();
  expect(newLinkText).not.toBe(initialLinkText);
  expect(newLinkText).toMatch(/https?:\/\/[^/]+\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+/);
});
