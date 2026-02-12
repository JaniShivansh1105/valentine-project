/**
 * Tests for OG API endpoint
 *
 * @module __tests__/og-api.test.ts
 */

// Mock feature flags before importing
jest.mock("@/lib/feature-flags", () => ({
  FEATURE_FLAGS: {
    OG_API: true,
    POLISHED_HERO: true,
    ANALYTICS: false,
  },
}));

// Mock store
jest.mock("@/lib/store", () => ({
  getReceipt: jest.fn(),
}));

import { GET } from "@/app/api/og/route";
import { getReceipt } from "@/lib/store";
import { NextRequest } from "next/server";

const mockGetReceipt = getReceipt as jest.MockedFunction<typeof getReceipt>;

// Mock Next.js server components for testing
jest.mock("next/server", () => {
  const NextResponse = jest.fn((body: string, init?: { status?: number; headers?: Record<string, string> }) => {
    const headersObj = init?.headers || {};
    return {
      json: () => Promise.resolve(JSON.parse(body)),
      text: () => Promise.resolve(body),
      status: init?.status || 200,
      headers: {
        get: (name: string) => {
          // Handle case-insensitive header lookup
          const lowerName = name.toLowerCase();
          for (const [key, value] of Object.entries(headersObj)) {
            if (key.toLowerCase() === lowerName) {
              return value;
            }
          }
          return undefined;
        },
      },
    };
  }) as jest.Mock & { json: (body: unknown, init?: { status?: number }) => unknown };
  
  NextResponse.json = (body: unknown, init?: { status?: number }) => {
    return {
      json: () => Promise.resolve(body),
      status: init?.status || 200,
      headers: {
        get: (name: string) => name.toLowerCase() === "content-type" ? "application/json" : undefined,
      },
    };
  };

  return {
    ...jest.requireActual("next/server"),
    NextRequest: jest.fn((url: string | Request) => {
      const urlObj = typeof url === "string" ? new URL(url) : new URL((url as Request).url);
      return {
        url: urlObj.toString(),
        nextUrl: urlObj,
        headers: new Map(),
        method: "GET",
        json: jest.fn().mockResolvedValue({}),
      };
    }),
    NextResponse,
  };
});

describe("/api/og endpoint", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when slug is missing", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = new (NextRequest as any)("http://localhost:3000/api/og");
    const response = await GET(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("slug");
  });

  it("returns valid SVG for existing receipt", async () => {
    mockGetReceipt.mockResolvedValue({
      slug: "abc12345",
      yourName: "Test User",
      partnerName: "Ex Partner",
      timeInvested: 24,
      moneySpent: 50000,
      emotionalDamage: 7,
      betrayalLevel: 3,
      note: "Test note",
      anonymous: false,
      tone: "wry",
      createdAt: "2026-02-11T12:00:00Z",
      moodPreset: "spicy",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = new (NextRequest as any)("http://localhost:3000/api/og?slug=abc12345");
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/svg+xml");

    const svg = await response.text();
    expect(svg).toContain("<svg");
    expect(svg).toContain("1200");
    expect(svg).toContain("630");
    expect(svg).toContain("ABC1"); // Slug uppercase in receipt number
  });

  it("returns placeholder SVG for non-existent receipt", async () => {
    mockGetReceipt.mockResolvedValue(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = new (NextRequest as any)("http://localhost:3000/api/og?slug=notfound");
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/svg+xml");

    const svg = await response.text();
    expect(svg).toContain("<svg");
    expect(svg).toContain("NOTF"); // Placeholder receipt number
  });

  it("SVG contains verdict and caption text", async () => {
    mockGetReceipt.mockResolvedValue({
      slug: "test1234",
      yourName: "Test",
      partnerName: "Partner",
      timeInvested: 12,
      moneySpent: 0,
      emotionalDamage: 5,
      betrayalLevel: 2,
      note: "",
      anonymous: false,
      tone: "wry",
      createdAt: "2026-02-11T12:00:00Z",
      moodPreset: "reflective",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = new (NextRequest as any)("http://localhost:3000/api/og?slug=test1234");
    const response = await GET(request);
    const svg = await response.text();

    // Check for verdict
    expect(svg).toContain("Closed without refund");
    // Check for share caption
    expect(svg).toContain("No refunds");
    expect(svg).toContain("glow up");
  });
});
