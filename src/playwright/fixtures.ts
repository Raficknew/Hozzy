import { test as base, type Page } from "@playwright/test";
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
};

export const test = base.extend<MyFixture>({
  authenticatedUser: async ({ browser }, use, testInfo) => {
    const ctx = await auth.$context;
    const authTest = ctx.test;

    const uniqueProjectName = testInfo.project.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const email = `e2e-${uniqueProjectName}-${testInfo.workerIndex}-${Date.now()}@example.com`;

    const user = authTest.createUser({
      email,
      name: "Test User",
      emailVerified: true,
    });

    const savedUser = await authTest.saveUser(user);

    const cookies = await authTest.getCookies({
      userId: savedUser.id,
      domain: "localhost",
    });

    const context = await browser.newContext();

    await context.addCookies(cookies);
    const authenticatedUserPage = new AuthenticatedUser(
      await context.newPage(),
    );

    try {
      await use(authenticatedUserPage);
    } finally {
      await context.close();
      await authTest.deleteUser(savedUser.id);
    }
  },
});

export { expect } from "@playwright/test";
