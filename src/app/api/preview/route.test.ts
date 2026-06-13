/**
 * @jest-environment node
 */
// Tests for src/app/api/preview/route.ts

import { NextRequest } from "next/server";
import { draftMode } from "next/headers";

const mockEnable = jest.fn();
const mockDisable = jest.fn();

jest.mock("next/headers", () => ({
  draftMode: jest.fn(),
}));

import { GET, POST } from "./route";

const SECRET = "test-secret";

beforeEach(() => {
  process.env.CMS_REVALIDATE_SECRET = SECRET;
  mockEnable.mockClear();
  mockDisable.mockClear();
  (draftMode as jest.Mock).mockResolvedValue({
    enable: mockEnable,
    disable: mockDisable,
  });
});

afterEach(() => {
  delete process.env.CMS_REVALIDATE_SECRET;
});

describe("GET /api/preview", () => {
  it("returns 401 when secret is wrong", async () => {
    const req = new NextRequest("http://localhost:3000/api/preview?secret=wrong");
    const res = await GET(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/invalid secret/i);
  });

  it("returns 401 when secret is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/preview");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("enables draft mode and redirects to / by default", async () => {
    const req = new NextRequest(`http://localhost:3000/api/preview?secret=${SECRET}`);
    const res = await GET(req);
    expect(mockEnable).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toMatch(/\/$/);
  });

  it("redirects to specified path", async () => {
    const req = new NextRequest(
      `http://localhost:3000/api/preview?secret=${SECRET}&redirect=/pricing`
    );
    const res = await GET(req);
    expect(mockEnable).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/pricing");
  });
});

describe("POST /api/preview", () => {
  it("disables draft mode and returns success message", async () => {
    const res = await POST();
    expect(mockDisable).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toMatch(/disabled/i);
  });
});
