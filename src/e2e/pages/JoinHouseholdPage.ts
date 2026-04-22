import type { Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";

export class JoinHouseholdPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToInviteLink(inviteLink: string) {
    await this.page.goto(inviteLink);
  }

  async joinHousehold() {
    await this.page.getByRole("button", { name: /join|dołącz/i }).click();
  }

  async expectJoinButtonVisible() {
    await expect(
      this.page.getByRole("button", { name: /join|dołącz/i }),
    ).toBeVisible();
  }
}
