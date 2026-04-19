import { expect, test } from "@/playwright/fixtures";
import {
  createHouseholdFromHome,
  householdAccountSettingsUrlPattern,
  householdDashboardUrlPattern,
  householdTransactionsUrlPattern,
} from "./helpers/household";
import { DashboardPage } from "./pages/DashboardPage";

test("should be able to navigate to a household dashboard and then go to dashboard", async ({
  authenticatedUser,
}) => {
  await createHouseholdFromHome(authenticatedUser.page, {
    name: "Test Household",
    description: "Household created in e2e test",
    currency: "USD",
    balance: 1000,
  });

  const dashboardPage = new DashboardPage(authenticatedUser.page);

  await dashboardPage.goToDashboard();

  await expect(authenticatedUser.page).toHaveURL(householdDashboardUrlPattern);

  await dashboardPage.goToTransactions();

  await expect(authenticatedUser.page).toHaveURL(
    householdTransactionsUrlPattern,
  );

  await dashboardPage.goToSettings();

  await expect(authenticatedUser.page).toHaveURL(
    householdAccountSettingsUrlPattern,
  );
});

test("authenticated user should be able to log out from the dashboard page", async ({
  authenticatedUser,
}) => {
  await createHouseholdFromHome(authenticatedUser.page, {
    name: "Test Household",
    description: "Household created in e2e test",
    currency: "USD",
    balance: 1000,
  });

  const dashboardPage = new DashboardPage(authenticatedUser.page);

  await dashboardPage.goToDashboard();

  await expect(authenticatedUser.page).toHaveURL(householdDashboardUrlPattern);

  await dashboardPage.logOut();

  await expect(authenticatedUser.page).toHaveURL("/sign-in");
});
