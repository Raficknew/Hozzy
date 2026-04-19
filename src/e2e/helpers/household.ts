import type { Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";
import { HomePage } from "../pages/HomePage";
import { CreateFormPage } from "../pages/household_form/CreateFormPage";

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
