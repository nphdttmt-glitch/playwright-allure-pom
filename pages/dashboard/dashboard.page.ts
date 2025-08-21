import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base.page";
import { step } from "allure-js-commons";
import { isSorted } from "../../utils/helpers";

export class DashboardPage extends BasePage {
    readonly pageTitle: Locator;
    readonly shoppingCartButton: Locator;
    readonly cartIcon: Locator;
    readonly productsSortComboBox: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.locator('//div[@class="app_logo"]');
        this.shoppingCartButton = page.locator('//div[@id="shopping_cart_container"]');
        this.cartIcon = page.locator('//div[@id="shopping_cart_container"]');
        this.productsSortComboBox = page.locator('//select[@class="product_sort_container"]');
    }

    // =========================
    // 🚀 Actions
    // =========================
    async addToCart(productName: string) {
        const productLocator = this.page.locator(`//div[contains(@class, "inventory_item") and .//div[contains(text(), "${productName}")]]`);
        const addToCartButton = productLocator.locator('xpath=.//button[text()="Add to cart"]');
        await step(`Click nút "Add to cart" cho sản phẩm: ${productName}`, async () => {
            await this.click(addToCartButton, `Click nút "Add to cart" cho sản phẩm: ${productName}`);
        });
    }

    async addToCartByIndex(index: number) {
        const productLocator = this.page.locator(`//div[@class="inventory_list"]//div[@class="inventory_item"][${index}]`);
        const addToCartButton = productLocator.locator('xpath=.//button[text()="Add to cart"]');
        await step(`Click nút "Add to cart" cho sản phẩm ở vị trí: ${index}`, async () => {
            await this.click(addToCartButton, `Click nút "Add to cart" cho sản phẩm ở vị trí: ${index}`);
        });
    }

    async goToCart() {
        await step("Đi tới giỏ hàng", async () => {
            await this.click(this.shoppingCartButton, "Click nút giỏ hàng");
        });
    }

    async selectProductSortOption(option: string) {
        await step(`Chọn tùy chọn sắp xếp sản phẩm: ${option}`, async () => {
            await this.productsSortComboBox.selectOption(option);
        });
    }

    // =========================
    // 📦 Helpers
    // =========================
    async getProductNames(): Promise<(string | null)[]> {
        return await step("Lấy danh sách tên sản phẩm", async () => {
            const productNames = [];
            const products = this.page.locator('//div[normalize-space(@class) = "inventory_item_name"]');
            for (let i = 0; i < await products.count(); i++) {
                productNames.push(await products.nth(i).textContent());
            }
            return productNames;
        });
    }

    async getProductPrices(): Promise<(string | null)[]> {
        return await step("Lấy danh sách giá sản phẩm", async () => {
            const productPrices = [];
            const prices = this.page.locator('//div[normalize-space(@class) = "inventory_item_price"]');
            for (let i = 0; i < await prices.count(); i++) {
                productPrices.push(await prices.nth(i).textContent());
            }
            return productPrices;
        });
    }

    // =========================
    // ✅ Assertions
    // =========================
    async assertRemovebuttonVisible(productName: string) {
        const productLocator = this.page.locator(`//div[contains(@class,"inventory_item") and .//div[contains(text(), "${productName}")]]`);
        const removeButton = productLocator.locator('xpath=.//button[text()="Remove"]');
        await step(`Xác minh nút "Remove" hiển thị cho sản phẩm: ${productName}`, async () => {
            await this.assertVisible(removeButton, `Nút "Remove" cho sản phẩm: ${productName} được hiển thị`);
        });
    }

    async assertAddToCartButtonInvisible(productName: string) {
        const productLocator = this.page.locator(`//div[contains(@class,"inventory_item") and .//div[contains(text(), "${productName}")]]`);
        const addToCartButton = productLocator.locator('xpath=.//button[text()="Add to cart"]');
        await step(`Xác minh nút "Add to cart" không hiển thị cho sản phẩm: ${productName}`, async () => {
            await expect(addToCartButton).toBeHidden(); 
        });
    }

    async assertProductsSortedByName(order: "asc" | "desc") {
        const productNamesWithNull = await this.getProductNames();
        const productNames = productNamesWithNull.filter(
            (name): name is string => name !== null
        );

        await step(`Xác minh sản phẩm đã được sắp xếp theo tên (${order})`, async () => {
            expect(isSorted(productNames, order)).toBe(true);
        });
    }

    async assertProductsSortedByPrice(order: "asc" | "desc") {
        const productPricesWithNull = await this.getProductPrices();
        const productPrices = productPricesWithNull.filter(
            (price): price is string => price !== null
        );

        await step(`Xác minh sản phẩm đã được sắp xếp theo giá (${order})`, async () => {
            expect(isSorted(productPrices, order)).toBe(true);
        });
    }
}
