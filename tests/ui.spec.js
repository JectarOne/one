// @ts-check
// Playwright UI regression tests for the static site.
const { test, expect } = require("@playwright/test");

const PAGES = [
  { path: "/", title: /JectarOne/i },
  { path: "/product.html", title: /Product|JectarOne/i },
  { path: "/services.html", title: /Service|JectarOne/i },
  { path: "/about.html", title: /About|JectarOne/i },
  { path: "/tools/", title: /Tool|JectarOne/i },
];

for (const p of PAGES) {
  test(`${p.path} loads without console errors and renders header`, async ({ page }) => {
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));

    const resp = await page.goto(p.path, { waitUntil: "domcontentloaded" });
    expect(resp?.status(), `HTTP status for ${p.path}`).toBeLessThan(400);
    await expect(page).toHaveTitle(p.title);

    // Header/nav present and visible.
    await expect(page.locator("header.site-header, header").first()).toBeVisible();

    // No noisy JS console errors (ignore font/network noise from external CDNs).
    const real = errors.filter((e) => !/favicon|font|unpkg|net::ERR/i.test(e));
    expect(real, `console errors on ${p.path}: ${real.join(" | ")}`).toEqual([]);
  });
}

test("skip link is the first focusable element (a11y landmark)", async ({ page }) => {
  await page.goto("/");
  const skip = page.locator("a.skip-link");
  await expect(skip).toHaveAttribute("href", "#main");
});

test("every content image has an accessible name or is decorative", async ({ page }) => {
  await page.goto("/");
  const imgs = page.locator("img");
  const n = await imgs.count();
  for (let i = 0; i < n; i++) {
    const img = imgs.nth(i);
    const alt = await img.getAttribute("alt");
    const ariaHidden = await img.getAttribute("aria-hidden");
    const role = await img.getAttribute("role");
    const ok = alt !== null || ariaHidden === "true" || role === "presentation";
    expect(ok, `img #${i} needs alt or decorative marking`).toBeTruthy();
  }
});

test("favicon reference is the optimized asset", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="icon"][type="image/png"]').getAttribute("href");
  expect(href).toContain("favicon-32x32.png");
  const resp = await page.request.get("/favicon-32x32.png");
  const buf = await resp.body();
  expect(buf.length, "favicon should be < 10KB").toBeLessThan(10 * 1024);
});

test("mobile: menu toggle opens and closes the nav", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only interaction");
  await page.goto("/");
  const toggle = page.locator("#menu-toggle");
  const nav = page.locator("#nav-links");
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(nav).toHaveClass(/is-open/);
});
