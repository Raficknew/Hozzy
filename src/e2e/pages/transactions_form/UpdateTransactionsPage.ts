import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";

export class UpdateTransactionsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private visibleDialog(): Locator {
    return this.page.locator('[role="dialog"]:visible').first();
  }

  private tableRowByName(name: string): Locator {
    return this.page.locator("tbody tr").filter({ hasText: name }).first();
  }

  async openEditTransaction(name: string) {
    const row = this.tableRowByName(name);
    await expect(row).toBeVisible();
    await row.getByRole("button").first().click();
    await expect(this.visibleDialog()).toBeVisible();
  }

  async fillPrice(price: number) {
    await this.visibleDialog()
      .getByLabel(/price|kwota/i)
      .fill(String(price));
  }

  async fillName(name: string) {
    await this.visibleDialog()
      .getByLabel(/name|nazwa/i)
      .fill(name);
  }

  async submitEdit() {
    await this.visibleDialog()
      .getByRole("button", { name: /save|zapisz/i })
      .click();
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
    await row.getByRole("button").nth(1).click();
    await this.page.getByRole("button", { name: /yes|potwierd/i }).click();
  }

  async expectTransactionVisible(name: string) {
    await expect(this.tableRowByName(name)).toBeVisible();
  }

  async expectTransactionNotVisible(name: string) {
    await expect(this.tableRowByName(name)).toHaveCount(0);
  }

  async expectUpdateSuccessToast() {
    await expect(
      this.page.getByText(
        /transaction updated successfully|transakcja została pomyślnie zaktualizowana/i,
      ),
    ).toBeVisible();
  }

  async expectDeleteSuccessToast() {
    await expect(
      this.page.getByText(
        /transaction deleted successfully|transakcja została pomyślnie usunięta/i,
      ),
    ).toBeVisible();
  }
}
