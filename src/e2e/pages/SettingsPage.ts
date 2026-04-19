import type { Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";

export class SettingsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToHouseholdSettings() {
    await this.page.getByRole("link", { name: /^household$/i }).click();
  }

  async goToAccountSettings() {
    await this.page.getByRole("link", { name: /^account$/i }).click();
  }

  async goToCategoriesSettings() {
    await this.page.getByRole("link", { name: /^categories$/i }).click();
  }

  private inviteLinkTrigger() {
    return this.page.locator('[data-testid="invite-link-trigger"]:visible');
  }

  private inviteLinkText() {
    return this.page.locator('[data-testid="invite-link-text"]:visible');
  }

  private inviteLinkCopyButton() {
    return this.page.locator('[data-testid="invite-link-copy"]:visible');
  }

  private inviteLinkRegenerateButton() {
    return this.page.locator('[data-testid="invite-link-regenerate"]:visible');
  }

  async openInviteLinkPopover() {
    await this.inviteLinkTrigger().click();
    await expect(this.inviteLinkText()).toBeVisible();
  }

  async getInviteLinkText(): Promise<string | null> {
    return this.inviteLinkText().textContent();
  }

  async copyInviteLink() {
    await this.inviteLinkCopyButton().click();
    await expect(this.page.getByText(/link copied/i)).toBeVisible();
  }

  async regenerateInviteLink() {
    await this.inviteLinkRegenerateButton().click();
    await expect(
      this.page.getByText(/link.*updated|zaktualizowan/i),
    ).toBeVisible();
  }
}
