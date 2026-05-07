import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";
import { householdDashboardUrlPattern } from "../helpers/household";

export class JoinHouseholdPage {
  readonly page: Page;

  readonly joinButtonLocator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.joinButtonLocator = this.page.getByTestId("join-household-btn");
  }

  async goToInviteLink(inviteLink: string) {
    await this.page.goto(inviteLink);
  }

  async joinHousehold() {
    await this.joinButtonLocator.click();
    await expect(this.page).toHaveURL(householdDashboardUrlPattern);
  }

  async expectJoinButtonVisible() {
    await expect(this.joinButtonLocator).toBeVisible();
  }

  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(householdDashboardUrlPattern);
  }

  async expectRedirectToSignIn() {
    await expect(this.page).toHaveURL(/\/sign-in$/);
  }
}
