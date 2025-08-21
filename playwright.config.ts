import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
    ],
    reporter: [
        ['list'],
        ['allure-playwright']
    ],
    use: {
        headless: false,
        launchOptions: {
            args: ["--start-maximized"],
        },
        viewport: null,
        screenshot: 'on',
        video: 'retain-on-failure',
        trace: 'on-first-retry'
    }
});
