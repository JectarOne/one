// @ts-check
// Accessibility regression tests using axe-core.
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const PAGES = ["/", "/product.html", "/services.html", "/about.html", "/tools/", "/contact.html"];

// Fail the build only on serious/critical violations to avoid churn on
// advisory best-practice rules, while still catching real barriers.
const BLOCKING = new Set(["serious", "critical"]);

for (const path of PAGES) {
  test(`a11y: ${path} has no serious/critical axe violations`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "run axe once on desktop");
    const resp = await page.goto(path, { waitUntil: "domcontentloaded" });
    test.skip(!resp || resp.status() >= 400, `page ${path} not present`);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter((v) => BLOCKING.has(v.impact || ""));
    const summary = blocking
      .map((v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}`)
      .join("\n");
    expect(blocking, `axe violations on ${path}:\n${summary}`).toEqual([]);
  });
}
