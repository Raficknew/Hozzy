import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";

export class SettingsPage {
  readonly page: Page;

  readonly householdSettingsLinkLocator: Locator;
  readonly accountSettingsLinkLocator: Locator;
  readonly categoriesSettingsLinkLocator: Locator;
  readonly inviteLinkTriggerLocator: Locator;
  readonly inviteLinkTextLocator: Locator;
  readonly inviteLinkCopyLocator: Locator;
  readonly inviteLinkRegenerateLocator: Locator;
  readonly inviteLinkCopySuccessToastLocator: Locator;
  readonly inviteLinkRegenerateSuccessToastLocator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.householdSettingsLinkLocator = this.page
      .getByTestId("settings-household-link")
      .first();
    this.accountSettingsLinkLocator = this.page
      .getByTestId("settings-account-link")
      .first();
    this.categoriesSettingsLinkLocator = this.page
      .getByTestId("settings-categories-link")
      .first();
    this.inviteLinkTriggerLocator = this.page
      .getByTestId("invite-link-trigger")
      .first();
    this.inviteLinkTextLocator = this.page.getByTestId("invite-link-text");
    this.inviteLinkCopyLocator = this.page.getByTestId("invite-link-copy");
    this.inviteLinkRegenerateLocator = this.page.getByTestId(
      "invite-link-regenerate",
    );
    this.inviteLinkCopySuccessToastLocator = this.page.locator(
      '[data-sonner-toast][data-type="success"]',
    );
    this.inviteLinkRegenerateSuccessToastLocator = this.page.locator(
      '[data-sonner-toast][data-type="success"]',
    );
  }

  async goToHouseholdSettings() {
    await this.householdSettingsLinkLocator.click();
  }

  async goToAccountSettings() {
    await this.accountSettingsLinkLocator.click();
  }

  async goToCategoriesSettings() {
    await this.categoriesSettingsLinkLocator.click();
  }

  async openInviteLinkPopover() {
    await this.inviteLinkTriggerLocator.click();
    await expect(this.inviteLinkTextLocator).toBeVisible();
  }

  async getInviteLinkText(): Promise<string | null> {
    return this.inviteLinkTextLocator.textContent();
  }

  async copyInviteLink() {
    await this.inviteLinkCopyLocator.click();
    await expect(this.inviteLinkCopySuccessToastLocator).toBeVisible();
  }

  async regenerateInviteLink() {
    await this.inviteLinkRegenerateLocator.click();
    await expect(this.inviteLinkRegenerateSuccessToastLocator).toBeVisible();
  }
}
