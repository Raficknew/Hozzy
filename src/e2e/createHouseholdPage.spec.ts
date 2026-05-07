import { test } from "@/playwright/fixtures";
import { CreateFormPage } from "./pages/household_form/CreateFormPage";

test("should create household and redirect to household dashboard", async ({
  authenticatedUser,
}) => {
  const createPage = new CreateFormPage(authenticatedUser.page);

  await createPage.goTo();
  await createPage.fillAndSubmitForm({
    name: "E2E Test Household",
    description: "Household created in e2e test",
    currency: "USD",
    balance: 1000,
  });
});

test("should create household with different currencies", async ({
  authenticatedUser,
}) => {
  const createPage = new CreateFormPage(authenticatedUser.page);

  await createPage.goTo();
  await createPage.fillAndSubmitForm({
    name: "EUR Test Household",
    description: "Testing with EUR",
    currency: "EUR",
    balance: 5000,
  });
});

test("should handle form submission without optional balance", async ({
  authenticatedUser,
}) => {
  const createPage = new CreateFormPage(authenticatedUser.page);

  await createPage.goTo();

  await createPage.fillName("No Balance Household");
  await createPage.fillDescription("Household without balance");
  await createPage.selectCurrency("PLN");
  await createPage.submitForm();
});
