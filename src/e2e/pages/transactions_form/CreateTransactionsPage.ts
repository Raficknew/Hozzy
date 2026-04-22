import type { Locator, Page } from "@playwright/test";
import { expect } from "@/playwright/fixtures";

export class CreateTransactionsPage {
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

  async openCreateTransactionDialog() {
    await this.page
      .getByRole("button", { name: /add|dodaj/i })
      .first()
      .click();
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

  async selectFirstCategory() {
    await this.visibleDialog()
      .locator('[role="combobox"]')
      .filter({ hasText: /choose|wybierz/i })
      .first()
      .click();
    await this.page.locator('[role="option"]').first().click();
  }

  async submitCreate() {
    await this.visibleDialog()
      .getByRole("button", { name: /add|dodaj/i })
      .click();
  }

  async fillAndSubmitCreate(data: { name: string; price: number }) {
    await this.fillPrice(data.price);
    await this.fillName(data.name);
    await this.selectFirstCategory();
    await this.submitCreate();
  }

  async closeDialog() {
    const closeButton = this.visibleDialog().getByRole("button", {
      name: /close|zamknij/i,
    });

    if (await closeButton.isVisible()) {
      await closeButton.click();
      await expect(this.visibleDialog()).toHaveCount(0);
    }
  }

  async expectTransactionVisible(name: string) {
    await expect(this.tableRowByName(name)).toBeVisible();
  }

  async expectCreateSuccessToast() {
    await expect(
      this.page.getByText(
        /transaction created successfully|transakcja została pomyślnie utworzona/i,
      ),
    ).toBeVisible();
  }
}
