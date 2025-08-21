import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../pages/login/login.page";
import { step } from "allure-js-commons";
import { Config } from "../config/env.config";

type MyFixtures = {
    user: { username: string; password: string };
    loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({
    user: async ({ }, use) => {
        // user credentials từ env.config.ts
        await use(Config.credentials);
    },

    loggedInPage: async ({ page, user }, use) => {
        const loginPage = new LoginPage(page);

        await step("Đi tới trang login", async () => {
            await loginPage.goto(Config.baseURL);
        });

        await step(`Login với user: ${user.username}`, async () => {
            await loginPage.login(user.username, user.password);
        });

        await use(page);
    },
});

export { expect } from "@playwright/test";
