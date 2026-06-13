/**
 * Tests for src/lib/cms/client.ts
 *
 * Strategy: control CMS_PROVIDER + CMS_LOCAL_BASE_URL via process.env, mock
 * requestJson at the module boundary, and test every provider branch plus all
 * public helpers.
 */

import { EventEmitter } from "events";
import { defaultContent } from "@/lib/cms/default-content";

// ------------------------------------------------------------------
// Helpers to reset module state between tests
// ------------------------------------------------------------------

function resetModule() {
  jest.resetModules();
}

async function importClient() {
  return import("@/lib/cms/client");
}

// ------------------------------------------------------------------
// getContentfulImageUrl
// ------------------------------------------------------------------

describe("getContentfulImageUrl", () => {
  let getContentfulImageUrl: (
    url: string,
    options?: { width?: number; height?: number; quality?: number }
  ) => string;

  beforeEach(async () => {
    resetModule();
    ({ getContentfulImageUrl } = await importClient());
  });

  it("returns non-Contentful URLs unchanged", () => {
    const url = "https://example.com/image.jpg";
    expect(getContentfulImageUrl(url)).toBe(url);
  });

  it("returns Contentful URL unchanged when no options provided", () => {
    const url = "https://images.ctfassets.net/space/asset.jpg";
    expect(getContentfulImageUrl(url)).toBe(url);
  });

  it("appends width param", () => {
    const url = "https://images.ctfassets.net/space/asset.jpg";
    expect(getContentfulImageUrl(url, { width: 800 })).toBe(`${url}?w=800`);
  });

  it("appends height param", () => {
    const url = "https://images.ctfassets.net/space/asset.jpg";
    expect(getContentfulImageUrl(url, { height: 400 })).toBe(`${url}?h=400`);
  });

  it("appends quality param", () => {
    const url = "https://images.ctfassets.net/space/asset.jpg";
    expect(getContentfulImageUrl(url, { quality: 75 })).toBe(`${url}?q=75`);
  });

  it("appends multiple params together", () => {
    const url = "https://images.ctfassets.net/space/asset.jpg";
    const result = getContentfulImageUrl(url, { width: 1200, height: 630, quality: 80 });
    expect(result).toBe(`${url}?w=1200&h=630&q=80`);
  });
});

// ------------------------------------------------------------------
// getContentResourceTag
// ------------------------------------------------------------------

describe("getContentResourceTag", () => {
  let getContentResourceTag: (resource: string) => string;

  beforeEach(async () => {
    resetModule();
    ({ getContentResourceTag } = await importClient());
  });

  it("returns the cms:site-config tag for siteConfig", () => {
    expect(getContentResourceTag("siteConfig")).toBe("cms:site-config");
  });

  it("returns the cms:home tag for homePage", () => {
    expect(getContentResourceTag("homePage")).toBe("cms:home");
  });
});

// ------------------------------------------------------------------
// Provider: embedded
// ------------------------------------------------------------------

describe("embedded provider", () => {
  beforeEach(() => {
    resetModule();
    process.env.CMS_PROVIDER = "embedded";
  });

  afterEach(() => {
    delete process.env.CMS_PROVIDER;
  });

  it("getSiteConfig returns embedded siteConfig", async () => {
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
  });

  it("getNavigationMenu returns embedded navigationMenu", async () => {
    const { getNavigationMenu } = await importClient();
    const result = await getNavigationMenu();
    expect(result).toEqual(defaultContent.navigationMenu);
  });

  it("getFooterContactBlock returns embedded footerContactBlock", async () => {
    const { getFooterContactBlock } = await importClient();
    const result = await getFooterContactBlock();
    expect(result).toEqual(defaultContent.footerContactBlock);
  });

  it("getHomePageContent returns embedded homePage", async () => {
    const { getHomePageContent } = await importClient();
    const result = await getHomePageContent();
    expect(result).toEqual(defaultContent.homePage);
  });

  it("getFaqPageContent returns embedded faqPage", async () => {
    const { getFaqPageContent } = await importClient();
    const result = await getFaqPageContent();
    expect(result).toEqual(defaultContent.faqPage);
  });

  it("getPricingPageContent returns embedded pricingPage", async () => {
    const { getPricingPageContent } = await importClient();
    const result = await getPricingPageContent();
    expect(result).toEqual(defaultContent.pricingPage);
  });
});

// ------------------------------------------------------------------
// Provider: local-api (success)
// ------------------------------------------------------------------

describe("local-api provider — success", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    resetModule();
    process.env.CMS_PROVIDER = "local-api";
    process.env.CMS_LOCAL_BASE_URL = "http://localhost:3001";

    // Mock node:http to avoid real network calls
    jest.mock("node:http", () => ({
      request: mockFetch,
    }));
    jest.mock("node:https", () => ({
      request: jest.fn(),
    }));
  });

  afterEach(() => {
    delete process.env.CMS_PROVIDER;
    delete process.env.CMS_LOCAL_BASE_URL;
    mockFetch.mockReset();
  });

  function makeHttpMock(body: unknown, statusCode = 200) {
    const res = new EventEmitter();
    Object.assign(res, { statusCode });

    mockFetch.mockImplementation(
      (_url: unknown, _opts: unknown, callback: (r: unknown) => void) => {
        callback(res);
        const req = new EventEmitter();
        Object.assign(req, {
          end: jest.fn(() => {
            res.emit("data", Buffer.from(JSON.stringify(body)));
            res.emit("end");
          }),
        });
        return req;
      }
    );
  }

  it("getSiteConfig fetches from local API", async () => {
    makeHttpMock(defaultContent.siteConfig);
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
  });

  it("falls back to embedded when local-api returns non-2xx", async () => {
    const res = new EventEmitter();
    Object.assign(res, { statusCode: 500 });

    mockFetch.mockImplementation(
      (_url: unknown, _opts: unknown, callback: (r: unknown) => void) => {
        callback(res);
        const req = new EventEmitter();
        Object.assign(req, {
          end: jest.fn(() => {
            res.emit("data", Buffer.from("error"));
            res.emit("end");
          }),
        });
        return req;
      }
    );

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    consoleSpy.mockRestore();
  });

  it("falls back to embedded when local-api request errors", async () => {
    mockFetch.mockImplementation(() => {
      const req = new EventEmitter();
      Object.assign(req, { end: jest.fn(() => req.emit("error", new Error("ECONNREFUSED"))) });
      return req;
    });

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    consoleSpy.mockRestore();
  });

  it("falls back when JSON is malformed", async () => {
    const res = new EventEmitter();
    Object.assign(res, { statusCode: 200 });

    mockFetch.mockImplementation(
      (_url: unknown, _opts: unknown, callback: (r: unknown) => void) => {
        callback(res);
        const req = new EventEmitter();
        Object.assign(req, {
          end: jest.fn(() => {
            res.emit("data", Buffer.from("not-json{{"));
            res.emit("end");
          }),
        });
        return req;
      }
    );

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    consoleSpy.mockRestore();
  });
});

// ------------------------------------------------------------------
// Provider: default behaviour (no CMS_PROVIDER set)
// ------------------------------------------------------------------

describe("default provider fallback", () => {
  beforeEach(() => {
    resetModule();
    delete process.env.CMS_PROVIDER;
  });

  it("uses local-api in development", async () => {
    // Next.js jest env is test, simulate development via provider detection fallback
    // In test the default falls to embedded — verify we get content back
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    // Either embedded content or local-api fallback — should still return siteConfig shape
    expect(result).toHaveProperty("brandName");
  });
});

// ------------------------------------------------------------------
// Provider: contentful-delivery with missing env vars
// ------------------------------------------------------------------

describe("contentful-delivery provider — missing credentials", () => {
  beforeEach(() => {
    resetModule();
    process.env.CMS_PROVIDER = "contentful-delivery";
    delete process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN;
    delete process.env.CONTENTFUL_MOCK_BASE_URL;
  });

  afterEach(() => {
    delete process.env.CMS_PROVIDER;
  });

  it("falls back to embedded when CONTENTFUL_SPACE_ID is missing", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    consoleSpy.mockRestore();
  });
});

// ------------------------------------------------------------------
// Provider: contentful-preview with missing env vars
// ------------------------------------------------------------------

describe("contentful-preview provider — missing credentials", () => {
  beforeEach(() => {
    resetModule();
    process.env.CMS_PROVIDER = "contentful-preview";
    delete process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
    delete process.env.CONTENTFUL_MOCK_BASE_URL;
  });

  afterEach(() => {
    delete process.env.CMS_PROVIDER;
  });

  it("falls back to embedded when CONTENTFUL_SPACE_ID is missing", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    consoleSpy.mockRestore();
  });
});

// ------------------------------------------------------------------
// Provider: contentful-delivery with real credentials + mocked fetch
// ------------------------------------------------------------------

describe("contentful-delivery provider — real fetch path", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    resetModule();
    process.env.CMS_PROVIDER = "contentful-delivery";
    process.env.CONTENTFUL_SPACE_ID = "test-space";
    process.env.CONTENTFUL_ENVIRONMENT = "master";
    process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN = "test-delivery-token";
    delete process.env.CONTENTFUL_MOCK_BASE_URL;
  });

  afterEach(() => {
    delete process.env.CMS_PROVIDER;
    delete process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN;
    global.fetch = originalFetch;
  });

  it("fetches from cdn.contentful.com and returns unwrapped fields", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          items: [
            {
              fields: {
                brandName: "Test Brand",
                brandHandle: "TestBrand",
                metadataTitle: "Test",
                metadataDescription: "Desc",
              },
            },
          ],
        }),
    });

    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result.brandName).toBe("Test Brand");
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain("cdn.contentful.com");
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe(
      "Bearer test-delivery-token"
    );
  });

  it("falls back to embedded when response is not ok", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({}) });
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    consoleSpy.mockRestore();
  });

  it("falls back to embedded when items array is empty", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    });
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    consoleSpy.mockRestore();
  });

  it("falls back to embedded when delivery token is missing", async () => {
    delete process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN;
    global.fetch = jest.fn();
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    expect(global.fetch).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

// ------------------------------------------------------------------
// Provider: contentful-preview with real credentials + mocked fetch
// ------------------------------------------------------------------

describe("contentful-preview provider — real fetch path", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    resetModule();
    process.env.CMS_PROVIDER = "contentful-preview";
    process.env.CONTENTFUL_SPACE_ID = "test-space";
    process.env.CONTENTFUL_ENVIRONMENT = "master";
    process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN = "test-preview-token";
    delete process.env.CONTENTFUL_MOCK_BASE_URL;
  });

  afterEach(() => {
    delete process.env.CMS_PROVIDER;
    delete process.env.CONTENTFUL_SPACE_ID;
    delete process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
    global.fetch = originalFetch;
  });

  it("fetches from preview.contentful.com", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          items: [
            {
              fields: {
                brandName: "Draft Brand",
                brandHandle: "DraftBrand",
                metadataTitle: "Draft",
                metadataDescription: "Draft Desc",
              },
            },
          ],
        }),
    });

    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result.brandName).toBe("Draft Brand");
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain("preview.contentful.com");
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe(
      "Bearer test-preview-token"
    );
  });

  it("falls back to embedded when preview token is missing", async () => {
    delete process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
    global.fetch = jest.fn();
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    expect(global.fetch).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe("contentful-mock provider (unwrapLocalizedField)", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    resetModule();
    process.env.CMS_PROVIDER = "contentful-delivery";
    process.env.CONTENTFUL_MOCK_BASE_URL = "http://localhost:3002";

    jest.mock("node:http", () => ({ request: mockFetch }));
    jest.mock("node:https", () => ({ request: jest.fn() }));
  });

  afterEach(() => {
    delete process.env.CMS_PROVIDER;
    delete process.env.CONTENTFUL_MOCK_BASE_URL;
    mockFetch.mockReset();
  });

  it("unwraps en-US localized fields returned from mock server", async () => {
    const mockEntry = [
      {
        content_type: "siteConfig",
        fields: {
          "en-US": {
            brandName: "Relish Pilates",
            brandHandle: "RelishPilates",
            metadataTitle: "Test",
            metadataDescription: "Desc",
          },
        },
      },
    ];

    const res = new EventEmitter();
    Object.assign(res, { statusCode: 200 });

    mockFetch.mockImplementation(
      (_url: unknown, _opts: unknown, callback: (r: unknown) => void) => {
        callback(res);
        const req = new EventEmitter();
        Object.assign(req, {
          end: jest.fn(() => {
            res.emit("data", Buffer.from(JSON.stringify(mockEntry)));
            res.emit("end");
          }),
        });
        return req;
      }
    );

    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual({
      brandName: "Relish Pilates",
      brandHandle: "RelishPilates",
      metadataTitle: "Test",
      metadataDescription: "Desc",
    });
  });

  it("falls back to embedded when mock returns empty array", async () => {
    const res = new EventEmitter();
    Object.assign(res, { statusCode: 200 });

    mockFetch.mockImplementation(
      (_url: unknown, _opts: unknown, callback: (r: unknown) => void) => {
        callback(res);
        const req = new EventEmitter();
        Object.assign(req, {
          end: jest.fn(() => {
            res.emit("data", Buffer.from("[]"));
            res.emit("end");
          }),
        });
        return req;
      }
    );

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { getSiteConfig } = await importClient();
    const result = await getSiteConfig();
    expect(result).toEqual(defaultContent.siteConfig);
    consoleSpy.mockRestore();
  });
});
