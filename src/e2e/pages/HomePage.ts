import type { Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goTo() {
    await this.page.goto("/");
  }

  async goToHouseholdDashbaord(householdId: string) {
    await this.page.getByTestId(householdId).click();
  }

  async goToCreateHousehold() {
    await this.page.getByTestId("create-household-btn").click();
  }
}
