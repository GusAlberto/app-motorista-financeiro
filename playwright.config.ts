import { defineConfig, devices } from '@playwright/test'
import { loadEnvConfig } from '@next/env'

// Load .env.local (and .env*) into process.env so tests can read secrets like
// E2E_EMAIL / E2E_PASSWORD locally — same loader Next uses, so values match
// the app. In CI these come from the job env instead. Reuses an existing dep.
loadEnvConfig(process.cwd())

/**
 * Playwright E2E config.
 * Starts the production build and runs smoke tests against it.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  // The CRUD cycle (login → create → edit → delete) is legitimately long, and
  // a cold dev server compiles routes on demand — give generous, not infinite,
  // budgets so real hangs still fail.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
