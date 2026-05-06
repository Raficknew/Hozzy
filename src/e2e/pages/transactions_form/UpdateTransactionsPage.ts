import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";

export class UpdateTransactionsPage {
  readonly page: Page;

  readonly dialogLocator: Locator;
  readonly priceInputLocator: Locator;
  readonly nameInputLocator: Locator;
  readonly saveButtonLocator: Locator;
  readonly deleteConfirmButtonLocator: Locator;
  readonly updateSuccessToastLocator: Locator;
  readonly deleteSuccessToastLocator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dialogLocator = this.page.getByTestId("edit-transaction-dialog");
    this.priceInputLocator = this.page.getByTestId("transaction-price");
    this.nameInputLocator = this.page.getByTestId("transaction-name");
    this.saveButtonLocator = this.page.getByTestId("transaction-edit-submit");
    this.deleteConfirmButtonLocator =
      this.page.getByTestId("confirm-action-btn");
    this.updateSuccessToastLocator = this.page.locator(
      '[data-sonner-toast][data-type="success"]',
    );
    this.deleteSuccessToastLocator = this.page.locator(
      '[data-sonner-toast][data-type="success"]',
    );
  }

  private tableRowByName(name: string): Locator {
    return this.page.getByTestId(`transaction-row-${name}`);
  }

  async openEditTransaction(name: string) {
    const row = this.tableRowByName(name);
    await expect(row).toBeVisible();
    await row.getByTestId("transaction-edit-btn").click();
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

  async submitEdit() {
    await this.saveButtonLocator.click();
  }

  async editTransaction(
    currentName: string,
    data: { name: string; price: number },
  ) {
    await this.openEditTransaction(currentName);
    await this.fillPrice(data.price);
    await this.fillName(data.name);
    await this.submitEdit();
  }

  async deleteTransaction(name: string) {
    const row = this.tableRowByName(name);
    await expect(row).toBeVisible();
    await row.getByTestId("transaction-delete-btn").click();
    await this.deleteConfirmButtonLocator.click();
  }

  async expectTransactionVisible(name: string) {
    await expect(this.tableRowByName(name)).toBeVisible();
  }

  async expectTransactionNotVisible(name: string) {
    await expect(this.tableRowByName(name)).toHaveCount(0);
  }

  async expectUpdateSuccessToast() {
    await expect(this.updateSuccessToastLocator).toBeVisible();
  }

  async expectDeleteSuccessToast() {
    await expect(this.deleteSuccessToastLocator).toBeVisible();
  }
}
