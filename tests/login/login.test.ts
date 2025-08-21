import { test, expect } from "../../fixtures/test-fixture";
import { LoginPage } from "../../pages/login/login.page";
import { DashboardPage } from "../../pages/dashboard/dashboard.page";
import { Config } from "../../config/env.config";
import { step } from "allure-js-commons";

test.describe("Login Tests", () => {
    test("login page is displayed", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await step("Đi tới trang login", async () => {
            await loginPage.goto(Config.baseURL);
        });

        await step("Xác minh login page hiển thị", async () => {
            await loginPage.assertVisible(loginPage.pageTitle, "Xác minh tiêu đề trang hiển thị");
        });
    });

    test("login successfully with fixture", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);

        await step("Xác minh đã vào trang dashboard", async () => {
            await dashboardPage.assertUrl(/.*inventory/, "Xác minh regex URL trang dashboard");
        });
    });
});
