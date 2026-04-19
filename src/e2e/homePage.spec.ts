import { expect, test } from "@/playwright/fixtures";
import {
  createHouseholdFromHome,
  householdDashboardUrlPattern,
} from "./helpers/household";
import { HomePage } from "./pages/HomePage";

test.describe("Unauthenticated user", () => {
  test("should be redirected to the sign-in page", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goTo();
    await expect(page).toHaveURL("/sign-in");
  });
});

test.describe("Authenticated user", () => {
  test("should be able to navigate to the create household page", async ({
    authenticatedUser,
  }) => {
    const homePage = new HomePage(authenticatedUser.page);

    await homePage.goTo();
    await homePage.goToCreateHousehold();
    await expect(authenticatedUser.page).toHaveURL("/create");
  });

  test("should be able to navigate to a household dashboard", async ({
    authenticatedUser,
  }) => {
    await createHouseholdFromHome(authenticatedUser.page, {
      name: "Test Household",
      description: "Household created in e2e test",
      currency: "USD",
      balance: 1000,
    });

    const homePage = new HomePage(authenticatedUser.page);

    await homePage.goTo();
    await homePage.goToHouseholdDashbaord("Test Household");

    await expect(authenticatedUser.page).toHaveURL(
      householdDashboardUrlPattern,
    );
  });
});
