import type { Locator, Page } from "@playwright/test";

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
  }

  async goToCreateHousehold() {
    await this.createHouseholdButtonLocator.click();
  }
}
