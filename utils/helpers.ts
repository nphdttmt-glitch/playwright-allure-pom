import { Page, Locator } from '@playwright/test';

/**
 * **************************************************************************
 * **************************************************************************
 * 📦 Helpers
 * {Helper functions}
 * Non-used directly on the site or in test cases
 * These are non-actions
 * **************************************************************************
 * **************************************************************************
 */

/**
 * Waits for an element to exist in the DOM.
 */
async function waitForElement(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
}

/**
 * Waits for an element to be visible (displayed on screen).
 */
async function waitForElementVisible(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
}

// Group into one exportable utility object
export const DOMUtils = {
    waitForElement,
    waitForElementVisible,
};

/**
 * Generate a new random sequence of numbers along with a timestamp.
 * Format: yyyyMMddHHmmssSSS + random(3 digits)
 */
export function generateReadableTimeBasedId(): string {
    const now: Date = new Date();
    const timestamp: string = now.toISOString().replace(/[-:.TZ]/g, '');
    const random: string = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `${timestamp}${random}`;
}

/**
 * Splits a string by a given delimiter and returns the parts and their count.
 * @param input - The string to split.
 * @param delimiter - The delimiter to split by (default is a space).
 * @returns An object with the parts array and count.
 */

interface SplitResult {
    parts: string[];
    count: number;
}

export function splitString(input: string, delimiter: string = " "): SplitResult {
    const result = input.split(delimiter).map(part => part.trim());
    return {
        parts: result,
        count: result.length
    };
}

/**
 * Pause execution for a given amount of time (ms).
 */
export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if the array is sorted in ascending order
 */
export function isSortedAsc(arr: number[] | string[]): boolean {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

/**
 * Check if the array is sorted in descending order
 */
export function isSortedDesc(arr: number[] | string[]): boolean {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[i - 1]) {
            return false;
        }
    }
    return true;
}

/**
 * Check if the array is sorted (automatically detect ascending or descending)
 * @param order "asc" | "desc"
 */
export function isSorted(arr: number[] | string[], order: "asc" | "desc" = "asc"): boolean {
    return order === "asc" ? isSortedAsc(arr) : isSortedDesc(arr);
}

/**
 * Get a random element from an array
 * @param arr The array to select from
 * @returns A random element from the array
 */
export function getRandomArrayElement<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

/**
 * **************************************************************************
 * **************************************************************************
 * 🚀 Actions
 * {Common functions/Actions}
 * Perform a action on a site
 * Use above helper functions
 * Used directly on the site or in test cases
 * Maybe used as a action
 * **************************************************************************
 * **************************************************************************
 */

/**
 * Select sidebar menu by js
 */

export async function clickSidebarMenu(page: Page, menuPath: string) {
    // Split menuPath and set value into pathArray
    const rs: SplitResult = splitString(menuPath, "->")
    const pathArray: string[] = rs.parts
    const pathLength: number = rs.count

    let currentScope: Page | Locator = page; // Start from root

    for (let i = 0; i < pathLength; i++) {
        const label = pathArray[i];

        // Find the menu at the current level within the current DOM scope.
        const locator: Locator = currentScope.locator(`xpath=.//span[@class="title" and normalize-space(text())="${label}"]`);

        // Click on the menu at the current level
        await locator.first().click();

        // Wait for the submenu to render before proceeding.
        await page.waitForTimeout(300);

        // Update the scope to search for children within the newly opened branch.
        // Go up to the <li> element of the clicked label, then go down to the child <ul> branch.
        currentScope = locator.locator('xpath=ancestor::li[1]//ul[contains(@class, "page-sidebar-menu")]');
    }
}

/**
 * Combobox: have a input textbox below the dropdown option
 * User can input text into textbox then click the displayed option row
 * @param {*} page 
 * @param {string : combobox name label} comboboxName 
 * @param {string : the option value which user want to select} optionValue 
 */
export async function selectComboboxOption(page: Page, comboboxName: string, optionValue: string): Promise<void> {
    // Define the comboxbox element
    const combobox: Locator = page.locator(`//div[label[text()="${comboboxName}"] or div[text()="${comboboxName}"]]//ng-select`)
    const comboboxInput: Locator = page.locator(`//div[label[text()="${comboboxName}"] or div[text()="${comboboxName}"]]//ng-select//input`)

    await page.waitForLoadState('networkidle');

    // Click comboxbox, enter option value into combobox textbox
    await combobox.click();
    await comboboxInput.fill(optionValue)

    // Define the option locator
    const optionXpath = `//ng-dropdown-panel//span[text()="${optionValue}"]`
    const profileValueOption = page.locator(optionXpath);

    // Select the option need to select
    await profileValueOption.click();
}