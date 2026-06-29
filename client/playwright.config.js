import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL:   process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace:     'on-first-retry',
    screenshot: 'only-on-failure',
    video:     'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Auto-start dev server before tests when running locally
  webServer: {
    command:   'npm run dev',
    url:       'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout:   60000,
  },
});