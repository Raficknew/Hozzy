import type { Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { CreateFormPage } from "../pages/household_form/CreateFormPage";
import { SettingsPage } from "../pages/SettingsPage";

const householdIdPattern = "\\/(?:household-)?[a-zA-Z0-9-]+";

export const householdDashboardUrlPattern = new RegExp(
  `${householdIdPattern}$`,
);
export const householdTransactionsUrlPattern = new RegExp(
  `${householdIdPattern}\\/transactions$`,
);
export const householdSettingsUrlPattern = new RegExp(
  `${householdIdPattern}\\/settings\\/household$`,
);
export const householdAccountSettingsUrlPattern = new RegExp(
  `${householdIdPattern}\\/settings\\/account$`,
);
export const householdCategoriesSettingsUrlPattern = new RegExp(
  `${householdIdPattern}\\/settings\\/categories$`,
);
export const householdInviteLinkUrlPattern = new RegExp(
  `https?:\\/\\/[^/]+${householdIdPattern}\\/[a-zA-Z0-9-]+`,
);

type HouseholdInput = {
  name: string;
  description: string;
  currency: string;
  balance?: number;
};

export async function createHouseholdFromHome(
  page: Page,
  household: HouseholdInput,
) {
  const homePage = new HomePage(page);
  const createHouseholdPage = new CreateFormPage(page);

  await homePage.goTo();
  await homePage.goToCreateHousehold();
  await createHouseholdPage.fillAndSubmitForm(household);
}

export async function createHouseholdAndGetInviteLink(
  page: Page,
  household: HouseholdInput,
) {
  await createHouseholdFromHome(page, household);

  const dashboardPage = new DashboardPage(page);
  const settingsPage = new SettingsPage(page);

  await dashboardPage.goToDashboard();
  await dashboardPage.goToSettings();

  await settingsPage.openInviteLinkPopover();
  const inviteLink = await settingsPage.getInviteLinkText();

  expect(inviteLink).toBeTruthy();
  expect(inviteLink).toMatch(householdInviteLinkUrlPattern);

  return inviteLink as string;
}
