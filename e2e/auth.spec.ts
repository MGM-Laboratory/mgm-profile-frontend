import { expect, test } from "@playwright/test";

// Phase 5A: the private surface is auth-gated server-side; the login page
// offers Keycloak SSO. (Completing a real login requires the local Keycloak,
// covered by the containerized e2e once Docker is available.)

test("unauthenticated dashboard redirects to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("button", { name: /MGM SSO/i })).toBeVisible();
});

test("unauthenticated onboarding redirects to login", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page).toHaveURL(/\/login/);
});

test("login page renders the SSO entry point", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /MGM SSO/i })).toBeVisible();
});
