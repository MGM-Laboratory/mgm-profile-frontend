import { expect, test } from "@playwright/test";

// Phase 8: the admin console lives under the auth-gated (app) surface and
// additionally requires the Keycloak `admin` role. Unauthenticated visitors are
// redirected to login (the role check + force-edit flows are exercised by the
// containerized e2e once Docker/Keycloak are available).

test("unauthenticated admin console redirects to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("button", { name: /MGM SSO/i })).toBeVisible();
});

test("unauthenticated admin member page redirects to login", async ({ page }) => {
  await page.goto("/admin/some-sub-id");
  await expect(page).toHaveURL(/\/login/);
});
