import type { Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goTo() {
    await this.page.goto("/");
  }

  async goToHouseholdDashbaord(householdName: string) {
    await this.page
      .getByRole("link", { name: householdName, exact: true })
      .click();
  }

  async goToCreateHousehold() {
    await this.page.getByTestId("create-household-btn").click();
  }
}
