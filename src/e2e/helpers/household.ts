import type { Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { CreateFormPage } from "../pages/household_form/CreateFormPage";
import { SettingsPage } from "../pages/SettingsPage";

export const householdDashboardUrlPattern = /\/(?:household-)?[a-zA-Z0-9-]+$/;
export const householdTransactionsUrlPattern =
  /\/(?:household-)?[a-zA-Z0-9-]+\/transactions$/;
export const householdSettingsUrlPattern =
  /\/(?:household-)?[a-zA-Z0-9-]+\/settings\/household$/;
export const householdAccountSettingsUrlPattern =
  /\/(?:household-)?[a-zA-Z0-9-]+\/settings\/account$/;
export const householdCategoriesSettingsUrlPattern =
  /\/(?:household-)?[a-zA-Z0-9-]+\/settings\/categories$/;

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

  await expect(page).toHaveURL(householdSettingsUrlPattern);
}

export async function createHouseholdAndGetInviteLink(
  page: Page,
  household: HouseholdInput,
) {
  await createHouseholdFromHome(page, household);

  const dashboardPage = new DashboardPage(page);
  const settingsPage = new SettingsPage(page);

  await dashboardPage.goToDashboard();
  await expect(page).toHaveURL(householdDashboardUrlPattern);

  await dashboardPage.goToSettings();
  await expect(page).toHaveURL(householdAccountSettingsUrlPattern);

  await settingsPage.openInviteLinkPopover();
  const inviteLink = await settingsPage.getInviteLinkText();

  expect(inviteLink).toBeTruthy();
  expect(inviteLink).toMatch(/https?:\/\/[^/]+\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+/);

  return inviteLink as string;
}
