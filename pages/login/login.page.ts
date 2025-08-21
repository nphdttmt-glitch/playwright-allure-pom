import { Page, Locator } from "@playwright/test";
import { BasePage } from "../base.page";
import { step } from "allure-js-commons";

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly message: Locator;
    readonly pageTitle: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('//input[@id="user-name"]');
        this.passwordInput = page.locator('//input[@id="password"]');
        this.loginButton = page.locator('//input[@id="login-button"]');
        this.message = page.locator('#message');
        this.pageTitle = page.locator('//div[@class="login_logo" and text()="Swag Labs"]');
    }

    // =========================
    // 🚀 Actions
    // =========================
    async login(username: string, password: string) {
        await step(`Nhập username: ${username}`, async () => {
            await this.type(this.usernameInput, username, "Nhập username");
        });

        await step(`Nhập password`, async () => {
            await this.type(this.passwordInput, password, "Nhập password");
        });

        await step(`Click nút login`, async () => {
            await this.click(this.loginButton, "Click nút login");
        });
    }

    // =========================
    // 📦 Helpers
    // =========================
    async getMessage(): Promise<string | null> {
        return await step("Lấy message sau khi login", async () => {
            return this.getText(this.message, "Lấy message");
        });
    }

    // =========================
    // ✅ Assertions
    // =========================
}
