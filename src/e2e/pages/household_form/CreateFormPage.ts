import type { Locator, Page } from "@playwright/test";

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
  }

  async fillName(name: string) {
    await this.householdNameLocator.click();
    await this.householdNameLocator.fill(name);
  }

  async fillDescription(description: string) {
    await this.householdDescriptionLocator.click();
    await this.householdDescriptionLocator.fill(description);
  }

  async selectCurrency(currencyCode: string) {
    await this.householdCurrencyLocator.click();
    await this.page
      .getByTestId(`household-currency-option-${currencyCode.toLowerCase()}`)
      .click();
  }

  async fillBalance(balance: string | number) {
    await this.householdBalanceLocator.click();
    await this.householdBalanceLocator.fill(String(balance));
  }

  async submitForm() {
    await this.householdSubmitLocator.click();
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
