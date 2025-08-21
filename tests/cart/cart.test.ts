import { test, expect } from "../../fixtures/test-fixture";
import { DashboardPage } from "../../pages/dashboard/dashboard.page";
import { CartPage } from "../../pages/cart/cart.page";
import { Config } from "../../config/env.config";
import { step } from "allure-js-commons";
import { getRandomArrayElement } from "../../utils/helpers";

test.describe("Remove from cart", () => {
    let firstProductName: string | null;
    let secondProductName: string | null;
    let thirdProductName: string | null;

    test("remove if cart have a product", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);
        const cartPage = new CartPage(loggedInPage);
        const productName = getRandomArrayElement(await dashboardPage.getProductNames());

        await step("Select a product to add to cart", async () => {
            const productNames = await dashboardPage.getProductNames();
            if (productNames.length > 0) {
                await dashboardPage.addToCart(productName!);
            } else {
                throw new Error("No products found to add to cart");
            }
        });

        await step("Go to cart", async () => {
            await dashboardPage.goToCart();
        });

        await step(`Remove product "${productName}" from cart`, async () => {
            await cartPage.removeFromCart(productName!);
        });

        await step(`Verify product "${productName}" is removed from cart`, async () => {
            await cartPage.assertProductRemoved(productName!);
            await cartPage.assertShoppingCartBadgeRemoved();
        });
    });

    test("remove if cart have multiple products", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);
        const cartPage = new CartPage(loggedInPage);

        const productNames = await dashboardPage.getProductNames();
        if (productNames.length < 2) {
            throw new Error("Not enough products to test removing multiple items from cart");
        }

        firstProductName = getRandomArrayElement(productNames);
        secondProductName = getRandomArrayElement(productNames.filter(name => name !== firstProductName));
        thirdProductName = getRandomArrayElement(productNames.filter(name => name !== firstProductName && name !== secondProductName));

        await step(`Add products "${firstProductName}", "${secondProductName}" and "${thirdProductName}" to cart`, async () => {
            await dashboardPage.addToCart(firstProductName!);
            await dashboardPage.addToCart(secondProductName!);
            await dashboardPage.addToCart(thirdProductName!);
        });

        await step("Go to cart", async () => {
            await dashboardPage.goToCart();
        });

        await step(`Remove product "${firstProductName}" from cart`, async () => {
            await cartPage.removeFromCart(firstProductName!);
        });

        await step(`Verify product "${firstProductName}" is removed from cart`, async () => {
            await cartPage.assertProductRemoved(firstProductName!);
            await cartPage.assertProductExists(secondProductName!);
            await cartPage.assertProductExists(thirdProductName!);
            await cartPage.assertShoppingCartBadgeValue("2");
        });
    });

    test("remove all products from cart", async ({ loggedInPage }) => {
        const dashboardPage = new DashboardPage(loggedInPage);
        const cartPage = new CartPage(loggedInPage);

        const productNames = await dashboardPage.getProductNames();
        if (productNames.length < 2) {
            throw new Error("Not enough products to test removing multiple items from cart");
        }

        firstProductName = getRandomArrayElement(productNames);
        secondProductName = getRandomArrayElement(productNames.filter(name => name !== firstProductName));
        thirdProductName = getRandomArrayElement(productNames.filter(name => name !== firstProductName && name !== secondProductName));

        await step(`Add products "${firstProductName}", "${secondProductName}" and "${thirdProductName}" to cart`, async () => {
            await dashboardPage.addToCart(firstProductName!);
            await dashboardPage.addToCart(secondProductName!);
            await dashboardPage.addToCart(thirdProductName!);
        });

        await step("Go to cart", async () => {
            await dashboardPage.goToCart();
        });

        await step(`Remove all products from cart`, async () => {
            await cartPage.removeFromCart(firstProductName!);
            await cartPage.removeFromCart(secondProductName!);
            await cartPage.removeFromCart(thirdProductName!);
        });

        await step("Verify all products are removed from cart", async () => {
            await cartPage.assertProductRemoved(firstProductName!);
            await cartPage.assertProductRemoved(secondProductName!);
            await cartPage.assertProductRemoved(thirdProductName!);
            await cartPage.assertShoppingCartBadgeRemoved();
        });
    });

});
