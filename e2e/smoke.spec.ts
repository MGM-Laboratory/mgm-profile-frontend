import { expect, test } from "@playwright/test";

// Phase 1 smoke: the branded shell renders, 404 works, and the language
// switch flips UI strings between EN and ID.

test("landing page renders the branded hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("MGM Laboratory")).toBeVisible();
  // The header app name.
  await expect(page.getByRole("link", { name: "MGM Profile" })).toBeVisible();
});

test("unknown route renders the 404 page", async ({ page }) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("404")).toBeVisible();
});

test("language switch toggles UI strings to Indonesian", async ({ page }) => {
  await page.goto("/");
  // English subtitle by default.
  await expect(
    page.getByText("the lab's canonical member directory", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "id", exact: true }).click();
  // After switching, the Indonesian subtitle fragment should appear.
  await expect(page.getByText("direktori anggota resmi lab", { exact: false })).toBeVisible();
});
