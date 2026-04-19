import type { Page } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToDashboard() {
    await this.page.getByTestId("sidebar-dashboard").click();
  }

  async goToSettings() {
    await this.page.getByTestId("sidebar-settings").click();
  }

  async goToTransactions() {
    await this.page.getByTestId("sidebar-transactions").click();
  }

  async logOut() {
    await this.page.getByTestId("signout-trigger").click();
    await this.page.getByTestId("signout-confirm").click();
  }
}
