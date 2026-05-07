import { test } from "@/playwright/fixtures";
import { createHouseholdFromHome } from "./helpers/household";
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
  await dashboardPage.goToTransactions();
  await dashboardPage.goToSettings();
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
  await dashboardPage.logOut();
});
