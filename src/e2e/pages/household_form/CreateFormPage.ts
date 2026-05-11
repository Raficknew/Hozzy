import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";
import { householdSettingsUrlPattern } from "../../helpers/household";

export class CreateFormPage {
  readonly page: Page;

  readonly householdNameLocator: Locator;
  readonly householdDescriptionLocator: Locator;
  readonly householdCurrencyLocator: Locator;
  readonly householdBalanceLocator: Locator;
  readonly householdSubmitLocator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.householdNameLocator = this.page.getByTestId("household-name");
    this.householdDescriptionLocator = this.page.getByTestId(
      "household-description",
    );
    this.householdCurrencyLocator = this.page.getByTestId("household-currency");
    this.householdBalanceLocator = this.page.getByTestId("household-balance");
    this.householdSubmitLocator = this.page.getByTestId("household-submit");
  }

  async goTo() {
    await this.page.goto("/create");
    await expect(this.page).toHaveURL("/create");
    await expect(this.householdNameLocator).toBeVisible();
    await expect(this.householdDescriptionLocator).toBeVisible();
    await expect(this.householdCurrencyLocator).toBeVisible();
    await expect(this.householdBalanceLocator).toBeVisible();
    await expect(this.householdSubmitLocator).toBeVisible();
  }

  async fillName(name: string) {
    await expect(this.householdNameLocator).toBeVisible();
    await this.householdNameLocator.click();
    await this.householdNameLocator.fill(name);
    await expect(this.householdNameLocator).toHaveValue(name);
  }

  async fillDescription(description: string) {
    await expect(this.householdDescriptionLocator).toBeVisible();
    await this.householdDescriptionLocator.click();
    await this.householdDescriptionLocator.fill(description);
    await expect(this.householdDescriptionLocator).toHaveValue(description);
  }

  async selectCurrency(currencyCode: string) {
    await expect(this.householdCurrencyLocator).toBeVisible();
    await this.householdCurrencyLocator.click();
    const option = this.page.getByTestId(
      `household-currency-option-${currencyCode.toLowerCase()}`,
    );
    await expect(option).toBeVisible();
    await option.click();
    await expect(this.householdCurrencyLocator).toContainText(currencyCode, {
      ignoreCase: true,
    });
  }

  async fillBalance(balance: string | number) {
    await expect(this.householdBalanceLocator).toBeVisible();
    await this.householdBalanceLocator.click();
    await this.householdBalanceLocator.fill(String(balance));
    await expect(this.householdBalanceLocator).toHaveValue(String(balance));
  }

  async submitForm() {
    await expect(this.householdSubmitLocator).toBeVisible();
    await expect(this.householdSubmitLocator).toBeEnabled();
    await this.householdSubmitLocator.click();
    await expect(this.page).toHaveURL(householdSettingsUrlPattern);
  }

  async fillAndSubmitForm(data: {
    name: string;
    description: string;
    currency: string;
    balance?: number;
  }) {
    await this.fillName(data.name);
    await this.fillDescription(data.description);
    await this.selectCurrency(data.currency);
    if (data.balance !== undefined) {
      await this.fillBalance(data.balance);
    }
    await this.submitForm();
  }
}
