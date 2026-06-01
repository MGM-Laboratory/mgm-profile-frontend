import { expect, test } from "@playwright/test";

// Smoke: the branded shell renders, 404 works, and the language switch flips UI
// chrome between EN and ID.

test("home renders the directory shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /member directory/i })).toBeVisible();
  await expect(page.getByText("MGM Laboratory")).toBeVisible();
  // The header app name link.
  await expect(page.getByRole("link", { name: "MGM Profile" })).toBeVisible();
});

test("unknown profile slug renders the 404 page", async ({ page }) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("404")).toBeVisible();
});

test("language switch toggles header UI strings to Indonesian", async ({ page }) => {
  await page.goto("/");
  // The header sign-in control is localized.
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  await page.getByRole("button", { name: "id", exact: true }).click();
  await expect(page.getByRole("link", { name: "Masuk" })).toBeVisible();
});
