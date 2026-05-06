import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";

export class CreateTransactionsPage {
  readonly page: Page;

  readonly addTransactionButtonLocator: Locator;
  readonly dialogLocator: Locator;
  readonly priceInputLocator: Locator;
  readonly nameInputLocator: Locator;
  readonly categorySelectLocator: Locator;
  readonly submitButtonLocator: Locator;
  readonly closeButtonLocator: Locator;
  readonly categoryFirstOptionLocator: Locator;
  readonly createSuccessToastLocator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addTransactionButtonLocator = this.page.getByTestId(
      "add-transaction-btn-expense",
    );
    this.dialogLocator = this.page.getByTestId("create-transaction-dialog");
    this.priceInputLocator = this.page.getByTestId("transaction-price");
    this.nameInputLocator = this.page.getByTestId("transaction-name");
    this.categorySelectLocator = this.page.getByTestId(
      "transaction-category-select",
    );
    this.submitButtonLocator = this.page.getByTestId(
      "transaction-create-submit",
    );
    this.closeButtonLocator = this.dialogLocator.getByRole("button", {
      name: "Close",
    });
    this.categoryFirstOptionLocator = this.page.getByTestId(
      "transaction-category-option",
    );
    this.createSuccessToastLocator = this.page.locator(
      '[data-sonner-toast][data-type="success"]',
    );
  }

  private tableRowByName(name: string): Locator {
    return this.page.getByTestId(`transaction-row-${name}`);
  }

  async openCreateTransactionDialog() {
    await this.addTransactionButtonLocator.click();
    await expect(this.dialogLocator).toBeVisible();
  }

  async fillPrice(price: number) {
    await this.priceInputLocator.click();
    await this.priceInputLocator.fill(String(price));
  }

  async fillName(name: string) {
    await this.nameInputLocator.click();
    await this.nameInputLocator.fill(name);
  }

  async selectFirstCategory() {
    await this.categorySelectLocator.click();
    await this.categoryFirstOptionLocator.first().click();
  }

  async submitCreate() {
    await this.submitButtonLocator.click();
  }

  async fillAndSubmitCreate(data: { name: string; price: number }) {
    await this.fillPrice(data.price);
    await this.fillName(data.name);
    await this.selectFirstCategory();
    await this.submitCreate();
  }

  async closeDialog() {
    if (await this.closeButtonLocator.isVisible()) {
      await this.closeButtonLocator.click();
      await expect(this.dialogLocator).toHaveCount(0);
    }
  }

  async expectTransactionVisible(name: string) {
    await expect(this.tableRowByName(name)).toBeVisible();
  }

  async expectCreateSuccessToast() {
    await expect(this.createSuccessToastLocator).toBeVisible();
  }
}
