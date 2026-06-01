import { expect, test } from "@playwright/test";

// Directory behavior with a mocked public API (the real Meilisearch-backed path
// runs against the local stack). We intercept the browser's /api/public call.

const members = [
  {
    sub: "u1",
    slug: "alice",
    name: "Alice Wonder",
    nickname: "Ali",
    headline: "Frontend dev",
    division: "RnD - Website",
    avatarUrl: "",
  },
  {
    sub: "u2",
    slug: "bob",
    name: "Bob Builder",
    nickname: "Bob",
    headline: "Backend dev",
    division: "RnD - Website",
    avatarUrl: "",
  },
  {
    sub: "u3",
    slug: "carol",
    name: "Carol Reel",
    nickname: "Caro",
    headline: "Editor",
    division: "Media",
    avatarUrl: "",
  },
];

test("directory lists members grouped by division and links to profiles", async ({ page }) => {
  await page.route("**/api/public/members**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        members,
        total: members.length,
        offset: 0,
        limit: 24,
        hasMore: false,
        nextOffset: null,
      }),
    });
  });

  await page.goto("/");

  // Division headers appear (grouped).
  await expect(page.getByRole("heading", { name: "RnD - Website" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Media" })).toBeVisible();

  // Cards render and link to the slug.
  const alice = page.getByRole("link", { name: /Alice Wonder/ });
  await expect(alice).toBeVisible();
  await expect(alice).toHaveAttribute("href", "/alice");
});

test("directory shows an empty state when there are no matches", async ({ page }) => {
  await page.route("**/api/public/members**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        members: [],
        total: 0,
        offset: 0,
        limit: 24,
        hasMore: false,
        nextOffset: null,
      }),
    });
  });

  await page.goto("/");
  await expect(page.getByText(/no members match/i)).toBeVisible();
});
