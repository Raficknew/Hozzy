import { expect, test } from "@/playwright/fixtures";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { CreateFormPage } from "./pages/household_form/CreateFormPage";

test("should be able to navigate to a household dashboard and then go to dashboard", async ({
  authenticatedUser,
}) => {
  const homePage = new HomePage(authenticatedUser.page);

  await homePage.goTo();
  await homePage.goToCreateHousehold();
  const createHouseholdPage = new CreateFormPage(authenticatedUser.page);

  await createHouseholdPage.fillAndSubmitForm({
    name: "Test Household",
    description: "Household created in e2e test",
    currency: "USD",
    balance: 1000,
  });

  await expect(authenticatedUser.page).toHaveURL(
    /\/(?:household-)?[a-zA-Z0-9-]+\/settings\/household$/,
  );

  const dashboardPage = new DashboardPage(authenticatedUser.page);

  await dashboardPage.goToDashboard();

  await expect(authenticatedUser.page).toHaveURL(
    /\/(?:household-)?[a-zA-Z0-9-]+$/,
  );

  await dashboardPage.goToTransactions();

  await expect(authenticatedUser.page).toHaveURL(
    /\/(?:household-)?[a-zA-Z0-9-]+\/transactions$/,
  );

  await dashboardPage.goToSettings();

  await expect(authenticatedUser.page).toHaveURL(
    /\/(?:household-)?[a-zA-Z0-9-]+\/settings\/account$/,
  );
});
