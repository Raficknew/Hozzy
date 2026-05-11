import { test } from "@/playwright/fixtures";
import { createHouseholdFromHome } from "./helpers/household";
import { DashboardPage } from "./pages/DashboardPage";
import { CreateTransactionsPage } from "./pages/transactions_form/CreateTransactionsPage";
import { UpdateTransactionsPage } from "./pages/transactions_form/UpdateTransactionsPage";

test("should create, edit and delete transaction", async ({
  authenticatedUser,
}) => {
  await createHouseholdFromHome(authenticatedUser.page, {
    name: "Txn E2E Home",
    description: "Transaction flow coverage",
    currency: "USD",
    balance: 2000,
  });

  const dashboardPage = new DashboardPage(authenticatedUser.page);
  const createTransactionsPage = new CreateTransactionsPage(
    authenticatedUser.page,
  );
  const updateTransactionsPage = new UpdateTransactionsPage(
    authenticatedUser.page,
  );

  await dashboardPage.goToDashboard();

  const createdTransactionName = "E2E Grocery Transaction";
  const updatedTransactionName = "E2E Grocery Transaction Updated";

  await createTransactionsPage.openCreateTransactionDialog();
  await createTransactionsPage.fillAndSubmitCreate({
    name: createdTransactionName,
    price: 123.45,
  });
  await createTransactionsPage.expectCreateSuccessToast();
  await createTransactionsPage.expectTransactionVisible(createdTransactionName);
  await createTransactionsPage.closeDialog();

  await dashboardPage.goToTransactions();

  await updateTransactionsPage.expectTransactionVisible(createdTransactionName);

  await updateTransactionsPage.editTransaction(createdTransactionName, {
    name: updatedTransactionName,
    price: 150.99,
  });
  await updateTransactionsPage.expectUpdateSuccessToast();
  await updateTransactionsPage.expectTransactionVisible(updatedTransactionName);

  await updateTransactionsPage.deleteTransaction(updatedTransactionName);
  await updateTransactionsPage.expectDeleteSuccessToast();
  await updateTransactionsPage.expectTransactionNotVisible(
    updatedTransactionName,
  );
});
