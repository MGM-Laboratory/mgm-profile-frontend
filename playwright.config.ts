import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Production server in CI (built first); dev server locally for fast iteration.
    command: isCI ? `pnpm start --port ${PORT}` : `pnpm dev --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    // Dummy auth config so the server boots and routes resolve. These are NOT
    // real credentials; e2e only exercises the unauthenticated redirect and the
    // public surface (real Keycloak login needs the local stack / Docker).
    env: {
      AUTH_SECRET: "e2e-only-secret-not-for-production-use-1234567890",
      AUTH_URL: baseURL,
      AUTH_KEYCLOAK_ID: "mgm-profile-web-staging",
      AUTH_KEYCLOAK_ISSUER: "http://localhost:8081/realms/mgm",
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:8080/api/v1",
      NEXT_PUBLIC_SITE_URL: baseURL,
    },
  },
});
