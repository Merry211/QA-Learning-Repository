// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 120000,
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    reporter: 'html',
    use: {
        actionTimeout: 60000,
        navigationTimeout: 60000,
        trace: 'on-first-retry',
        // Set viewport to full screen size
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
            slowMo: 500,
            args: [
                '--start-maximized',
                '--window-size=1920,1080',
                '--window-position=0,0',
            ],
        },
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Override viewport for chromium
                viewport: { width: 1920, height: 1080 },
            },
        },
    ],
});