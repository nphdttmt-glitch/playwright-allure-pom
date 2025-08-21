import { test, expect } from "../../fixtures/test-fixture";
import { DashboardPage } from "../../pages/dashboard/dashboard.page";
import { step } from "allure-js-commons";
import { getRandomArrayElement } from "../../utils/helpers";

test.describe("Add to Cart", () => {
    let productName: string | null;

    test("add to cart successfully", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);
        productName= getRandomArrayElement(await dashboardPage.getProductNames());

        await step("Select a product to add to cart", async () => {
            const productNames = await dashboardPage.getProductNames();
            if (productNames.length > 0) {
                await dashboardPage.addToCart(productName!);
            } else {
                throw new Error("No products found to add to cart");
            }
        });

        await step(`Verify product "${productName}" is added to cart`, async () => {
            await dashboardPage.assertRemovebuttonVisible(productName!);
            await dashboardPage.assertShoppingCartBadgeValue("1");
        });
    });

    test("cannot add to cart a product that is already in the cart", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);

        await step(`Add to cart button invisible for product: ${productName}`, async () => {
            await dashboardPage.addToCart(productName!);
            await dashboardPage.assertAddToCartButtonInvisible(productName!);
        });
    });

    test("add two products to cart", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);
        // Get another product name, ensuring it's different from the first
        const anotherProductName = getRandomArrayElement(await dashboardPage.getProductNames().then(names => names.filter(name => name !== productName)));

        if (!anotherProductName) {
            throw new Error("No other products available to add to cart");
        }

        await step(`Add two products "${productName}" and "${anotherProductName}" to cart`, async () => {
            await dashboardPage.addToCart(productName!);
            await dashboardPage.addToCart(anotherProductName);
        });

        await step(`Verify two products "${productName}" and "${anotherProductName}" are added to cart`, async () => {
            await dashboardPage.assertRemovebuttonVisible(productName!);
            await dashboardPage.assertRemovebuttonVisible(anotherProductName);
            await dashboardPage.assertShoppingCartBadgeValue("2");
        });
    });
});

test.describe("Sorting Products", () => {
    test("sort products by name (A to Z)", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);

        await step("Sort products by name (A to Z)", async () => {
            await dashboardPage.selectProductSortOption("az");
        });

        await step("Verify products are sorted by name (A to Z)", async () => {
            await dashboardPage.assertProductsSortedByName("asc");
        });
    });

    test("sort products by name (Z to A)", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);

        await step("Sort products by name (Z to A)", async () => {
            await dashboardPage.selectProductSortOption("za");
        });

        await step("Verify products are sorted by name (Z to A)", async () => {
            await dashboardPage.assertProductsSortedByName("desc");
        });
    });

    test("sort products by price (low to high)", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);

        await step("Sort products by price (low to high)", async () => {
            await dashboardPage.selectProductSortOption("lohi");
        });

        await step("Verify products are sorted by price (low to high)", async () => {
            await dashboardPage.assertProductsSortedByPrice("asc");
        });
    });

    test("sort products by price (high to low)", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);

        await step("Sort products by price (high to low)", async () => {
            await dashboardPage.selectProductSortOption("hilo");
        });

        await step("Verify products are sorted by price (high to low)", async () => {
            await dashboardPage.assertProductsSortedByPrice("desc");
        });
    });
});