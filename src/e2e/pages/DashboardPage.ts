import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";

export class DashboardPage {
  readonly page: Page;

  readonly sidebarDashboardLocator: Locator;
  readonly sidebarSettingsLocator: Locator;
  readonly sidebarTransactionsLocator: Locator;
  readonly signoutTriggerLocator: Locator;
  readonly signoutConfirmLocator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.sidebarDashboardLocator = this.page.getByTestId("sidebar-dashboard");
    this.sidebarSettingsLocator = this.page.getByTestId("sidebar-settings");
    this.sidebarTransactionsLocator = this.page.getByTestId(
      "sidebar-transactions",
    );
    this.signoutTriggerLocator = this.page.getByTestId("signout-trigger");
    this.signoutConfirmLocator = this.page.getByTestId("signout-confirm");
  }

  async goToDashboard() {
    await this.sidebarDashboardLocator.click();
  }

  async goToSettings() {
    await this.sidebarSettingsLocator.click();
  }

  async goToTransactions() {
    await this.sidebarTransactionsLocator.click();
  }

  async logOut() {
    await this.signoutTriggerLocator.click();
    await this.signoutConfirmLocator.waitFor({ state: "visible" });
    await this.signoutConfirmLocator.click({ force: true });
    await expect(this.page).toHaveURL(/\/sign-in$/);
  }
}
