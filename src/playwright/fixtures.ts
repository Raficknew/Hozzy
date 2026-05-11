import {
  type Browser,
  test as base,
  type Page,
  type TestInfo,
} from "@playwright/test";
import { auth } from "@/lib/auth";

export * from "@playwright/test";

class AuthenticatedUser {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}

type MyFixture = {
  authenticatedUser: AuthenticatedUser;
  secondAuthenticatedUser: AuthenticatedUser;
};

async function createAuthenticatedUser(
  browser: Browser,
  testInfo: TestInfo,
  userName: string,
  userTag: string,
) {
  const ctx = await auth.$context;
  const authTest = ctx.test;

  const uniqueProjectName = testInfo.project.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");
  const email = `e2e-${userTag}-${uniqueProjectName}-${testInfo.workerIndex}-${Date.now()}@example.com`;

  const user = authTest.createUser({
    email,
    name: userName,
    emailVerified: true,
  });

  const savedUser = await authTest.saveUser(user);

  const cookies = await authTest.getCookies({
    userId: savedUser.id,
    domain: "localhost",
  });

  const context = await browser.newContext();
  await context.addCookies(cookies);

  return {
    authenticatedUser: new AuthenticatedUser(await context.newPage()),
    cleanup: async () => {
      await context.close();
      await authTest.deleteUser(savedUser.id);
    },
  };
}

export const test = base.extend<MyFixture>({
  authenticatedUser: async ({ browser }, use, testInfo) => {
    const primaryUser = await createAuthenticatedUser(
      browser,
      testInfo,
      "Test User",
      "primary",
    );

    try {
      await use(primaryUser.authenticatedUser);
    } finally {
      await primaryUser.cleanup();
    }
  },
  secondAuthenticatedUser: async ({ browser }, use, testInfo) => {
    const secondaryUser = await createAuthenticatedUser(
      browser,
      testInfo,
      "Invite User",
      "secondary",
    );

    try {
      await use(secondaryUser.authenticatedUser);
    } finally {
      await secondaryUser.cleanup();
    }
  },
});

export { expect } from "@playwright/test";
