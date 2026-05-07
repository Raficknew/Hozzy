import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";
import { householdDashboardUrlPattern } from "../helpers/household";

export class HomePage {
  readonly page: Page;

  readonly createHouseholdButtonLocator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.createHouseholdButtonLocator = this.page.getByTestId(
      "create-household-btn",
    );
  }

  async goTo() {
    await this.page.goto("/");
  }

  async goToHouseholdDashbaord(householdName: string) {
    await this.page.getByTestId(`household-link-${householdName}`).click();
    await expect(this.page).toHaveURL(householdDashboardUrlPattern);
  }

  async goToCreateHousehold() {
    await this.createHouseholdButtonLocator.click();
    await expect(this.page).toHaveURL("/create");
  }
}
