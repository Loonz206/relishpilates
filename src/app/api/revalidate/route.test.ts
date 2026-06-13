/**
 * @jest-environment node
 */
// Tests for src/app/api/revalidate/route.ts

import { NextRequest } from "next/server";

// Mock next/cache so no real ISR calls happen
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

import { revalidatePath, revalidateTag } from "next/cache";
import { POST } from "./route";

function makeRequest(opts: {
  body?: unknown;
  secret?: string;
  secretHeader?: string;
}): NextRequest {
  const url = "http://localhost:3000/api/revalidate";
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (opts.secretHeader !== undefined) {
    (headers as Record<string, string>)["x-cms-revalidate-secret"] = opts.secretHeader;
  }

  return new NextRequest(url, {
    method: "POST",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
}

const SECRET = "test-secret";

beforeEach(() => {
  process.env.CMS_REVALIDATE_SECRET = SECRET;
  jest.clearAllMocks();
});

afterEach(() => {
  delete process.env.CMS_REVALIDATE_SECRET;
});

describe("POST /api/revalidate", () => {
  it("returns 500 when CMS_REVALIDATE_SECRET is not configured", async () => {
    delete process.env.CMS_REVALIDATE_SECRET;
    const req = makeRequest({ secretHeader: SECRET });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/missing/i);
  });

  it("returns 401 when secret header is wrong", async () => {
    const req = makeRequest({ secretHeader: "wrong-secret" });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/unauthorized/i);
  });

  it("returns 401 when no secret provided", async () => {
    const req = makeRequest({});
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("accepts secret via query param", async () => {
    const url = `http://localhost:3000/api/revalidate?secret=${SECRET}`;
    const req = new NextRequest(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: "homePage" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("revalidates specific tag for known contentType", async () => {
    const req = makeRequest({ secretHeader: SECRET, body: { contentType: "homePage" } });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("cms:home", "default");
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toContain("cms:home");
  });

  it("revalidates tag for content_type (snake_case) field", async () => {
    const req = makeRequest({ secretHeader: SECRET, body: { content_type: "siteConfig" } });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalled();
  });

  it("falls back to revalidatePath when no contentType matches", async () => {
    const req = makeRequest({ secretHeader: SECRET, body: { contentType: "unknownType" } });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    const json = await res.json();
    expect(json.fallbackPath).toBe("/");
  });

  it("falls back to revalidatePath when body is empty", async () => {
    const req = makeRequest({ secretHeader: SECRET, body: {} });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("handles body parse failure gracefully", async () => {
    const url = "http://localhost:3000/api/revalidate";
    const req = new NextRequest(url, {
      method: "POST",
      headers: { "x-cms-revalidate-secret": SECRET },
      body: "not-json{{",
    });
    const res = await POST(req);
    // Should not throw; falls back to revalidatePath
    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalled();
  });

  it("revalidates explicit tags array", async () => {
    const req = makeRequest({
      secretHeader: SECRET,
      body: { tags: ["cms:home", "cms:footer"] },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("cms:home", "default");
    expect(revalidateTag).toHaveBeenCalledWith("cms:footer", "default");
  });

  it("ignores empty string tags", async () => {
    const req = makeRequest({
      secretHeader: SECRET,
      body: { tags: ["", "   ", "cms:faq"] },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("cms:faq", "default");
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it("handles Contentful-shaped webhook payload", async () => {
    const req = makeRequest({
      secretHeader: SECRET,
      body: {
        sys: {
          id: "entry-123",
          contentType: { sys: { id: "pricingPage" } },
          updatedAt: "2025-01-01T00:00:00Z",
        },
        fields: { heading: { "en-US": "Pricing" } },
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalled();
  });

  it("includes timestamp in successful response", async () => {
    const req = makeRequest({ secretHeader: SECRET, body: { contentType: "faqPage" } });
    const res = await POST(req);
    const json = await res.json();
    expect(json.timestamp).toBeDefined();
  });
});
