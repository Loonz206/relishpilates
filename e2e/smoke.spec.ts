import { test, expect } from "@playwright/test";

test.describe("Smoke — Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero heading is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Yummy, challenging, feel-good Pilates",
        level: 1,
      })
    ).toBeVisible();
  });

  test("CTA buttons are present", async ({ page }) => {
    // Hero CTA
    await expect(
      page.getByRole("link", { name: "Book a session" }).first()
    ).toBeVisible();
    // Navbar CTA
    await expect(
      page.getByRole("link", { name: "Book a Session" })
    ).toBeVisible();
  });

  test("main navigation renders with expected links", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav).toBeVisible();
    for (const label of ["Schedule", "Pricing", "Videos", "About", "FAQ"]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("desktop nav links hidden on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // The <ul> with nav links uses hidden md:flex — not visible on mobile
    const navList = page.locator("nav ul").first();
    await expect(navList).not.toBeVisible();
  });

  test("desktop nav links visible on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const navList = page.locator("nav ul").first();
    await expect(navList).toBeVisible();
  });

  test("no uncaught console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });

  test("id=main-content exists for skip navigation", async ({ page }) => {
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeAttached();
  });
});
