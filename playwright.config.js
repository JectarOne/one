// @ts-check
const { defineConfig, devices } = require("@playwright/test");

const PORT = 8099;

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.js/, // node:test security file is run separately
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "node tests/server.js",
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
