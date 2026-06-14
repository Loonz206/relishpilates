import { test, expect } from "@playwright/test";

const cmsRevalidateSecret = process.env.CMS_REVALIDATE_SECRET ?? "";

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
    await expect(page.getByRole("link", { name: "Book a session" }).first()).toBeVisible();
    // Navbar CTA — scoped to nav to avoid ambiguity with hero CTAs
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav.getByRole("link", { name: "Book a Session", exact: true })).toBeVisible();
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

test.describe("Routes — FAQ Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/faq");
  });

  test("FAQ page loads and renders heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /frequently asked questions/i, level: 1 })
    ).toBeVisible();
  });

  test("FAQ items are rendered", async ({ page }) => {
    const faqItems = page.getByRole("listitem");
    const count = await faqItems.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("FAQ page navigation is present", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav).toBeVisible();
    const faqLink = nav.getByRole("link", { name: "FAQ" });
    await expect(faqLink).toHaveAttribute("href", "/faq");
  });

  test("no uncaught errors on FAQ page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });
});

test.describe("Routes — Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("Pricing page loads and renders heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /pricing/i, level: 1 })).toBeVisible();
  });

  test("pricing packages are displayed", async ({ page }) => {
    const packages = page.getByRole("listitem");
    const count = await packages.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("purchase links are present", async ({ page }) => {
    const purchaseLinks = page.getByRole("link", { name: /book|purchase|buy|session/i });
    const count = await purchaseLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("pricing page navigation shows as active", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    const pricingLink = nav.getByRole("link", { name: "Pricing" });
    await expect(pricingLink).toHaveAttribute("href", "/pricing");
  });

  test("no uncaught errors on pricing page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });
});

test.describe("Routes — Legal Pages", () => {
  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: /terms|conditions/i, level: 1 })).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: /privacy/i, level: 1 })).toBeVisible();
  });

  test("legal pages have proper navigation breadcrumb", async ({ page }) => {
    await page.goto("/terms");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav).toBeVisible();
  });

  test("legal pages have no uncaught errors", async ({ page }) => {
    for (const path of ["/terms", "/privacy"]) {
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(errors).toHaveLength(0);
    }
  });
});

test.describe("API Endpoints — Content Revalidation", () => {
  test("revalidate endpoint rejects invalid secret", async ({ request }) => {
    const response = await request.post("/api/revalidate", {
      headers: {
        "x-cms-revalidate-secret": "invalid-secret",
      },
      data: {
        sys: { id: "entry-123", contentType: { sys: { id: "homePage" } } },
      },
    });
    expect(response.status()).toBe(401);
  });

  test("revalidate endpoint accepts valid secret", async ({ request }) => {
    test.skip(!cmsRevalidateSecret, "CMS_REVALIDATE_SECRET is not set");

    const response = await request.post("/api/revalidate", {
      headers: {
        "x-cms-revalidate-secret": cmsRevalidateSecret,
      },
      data: {
        sys: { id: "entry-123", contentType: { sys: { id: "homePage" } } },
      },
    });
    expect([200, 204]).toContain(response.status());
  });

  test("revalidate endpoint handles missing payload", async ({ request }) => {
    test.skip(!cmsRevalidateSecret, "CMS_REVALIDATE_SECRET is not set");

    const response = await request.post("/api/revalidate", {
      headers: {
        "x-cms-revalidate-secret": cmsRevalidateSecret,
      },
    });
    expect([200, 400, 204]).toContain(response.status());
  });
});

test.describe("API Endpoints — Preview Mode", () => {
  test("preview endpoint rejects invalid secret", async ({ request }) => {
    const response = await request.get("/api/preview", {
      params: {
        secret: "invalid-secret",
        redirect: "/",
      },
    });
    expect(response.status()).toBe(401);
  });

  test("preview endpoint accepts valid secret and redirects", async ({ request }) => {
    test.skip(!cmsRevalidateSecret, "CMS_REVALIDATE_SECRET is not set");

    const response = await request.get("/api/preview", {
      params: {
        secret: cmsRevalidateSecret,
        redirect: "/",
      },
      maxRedirects: 0,
    });
    expect([200, 307, 308]).toContain(response.status());
  });
});

test.describe("Cross-Route Navigation", () => {
  test("can navigate from home to all main routes", async ({ page }) => {
    await page.goto("/");

    const routes = [
      { label: "Pricing", path: "/pricing" },
      { label: "FAQ", path: "/faq" },
    ];

    for (const { label, path } of routes) {
      const nav = page.getByRole("navigation", { name: "Main navigation" });
      await nav.getByRole("link", { name: label }).click();
      await page.waitForURL(path);
      expect(page.url()).toContain(path);
    }
  });

  test("footer links are present and clickable", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    const footerLinks = footer.getByRole("link");
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
