import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";
import {
  householdAccountSettingsUrlPattern,
  householdDashboardUrlPattern,
  householdTransactionsUrlPattern,
} from "../helpers/household";

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
    await expect(this.page).toHaveURL(householdDashboardUrlPattern);
  }

  async goToSettings() {
    await this.sidebarSettingsLocator.click();
    await expect(this.page).toHaveURL(householdAccountSettingsUrlPattern);
  }

  async goToTransactions() {
    await this.sidebarTransactionsLocator.click();
    await expect(this.page).toHaveURL(householdTransactionsUrlPattern);
  }

  async logOut() {
    await this.signoutTriggerLocator.click();
    await this.signoutConfirmLocator.waitFor({ state: "visible" });
    await this.signoutConfirmLocator.click({ force: true });
    await expect(this.page).toHaveURL(/\/sign-in$/);
  }
}
