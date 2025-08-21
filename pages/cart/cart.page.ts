import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";
import { step } from "allure-js-commons";

export class CartPage extends BasePage {

    constructor(page: Page) {
        super(page);

    }

    // =========================
    // 🚀 Actions
    // =========================
    async removeFromCart(productName: string) {
        const productLocator = this.page.locator(`//div[@class="cart_item" and .//div[contains(text(), "${productName}")]]`);
        const removeButton = productLocator.locator('xpath=.//button[text()="Remove"]');
        await step(`Click nút "Remove" cho sản phẩm: ${productName}`, async () => {
            await this.click(removeButton, `Click nút "Remove" cho sản phẩm: ${productName}`);
        });
    }

    // =========================
    // 📦 Helpers
    // =========================


    // =========================
    // ✅ Assertions
    // =========================
    async assertProductRemoved(productName: string) {
        const productLocator = this.page.locator(`//div[@class="cart_item" and .//div[contains(text(), "${productName}")]]`);
        await step(`Xác minh sản phẩm "${productName}" đã bị xóa khỏi giỏ hàng`, async () => {
            await expect(productLocator).toHaveCount(0);
        });
    }

    async assertProductExists(productName: string) {
        const productLocator = this.page.locator(`//div[@class="cart_item" and .//div[contains(text(), "${productName}")]]`);
        await step(`Xác minh sản phẩm "${productName}" tồn tại trong giỏ hàng`, async () => {
            await expect(productLocator).toHaveCount(1);
        });
    }
}
