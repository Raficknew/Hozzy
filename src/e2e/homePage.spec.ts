import { expect, test } from "@/playwright/fixtures";
import { HomePage } from "./pages/HomePage";
import { CreateFormPage } from "./pages/household_form/CreateFormPage";

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

    await homePage.goTo();
    await homePage.goToHouseholdDashbaord("Test Household");

    await expect(authenticatedUser.page).toHaveURL(
      /\/(?:household-)?[a-zA-Z0-9-]+$/,
    );
  });
});
