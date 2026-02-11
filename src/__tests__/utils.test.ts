import { generateSlug, receiptUrl, withUtm } from "@/lib/utils";

describe("generateSlug", () => {
  it("returns an 8-character alphanumeric string", () => {
    const slug = generateSlug();
    expect(slug).toMatch(/^[a-z0-9]{8}$/);
  });

  it("generates unique slugs", () => {
    const slugs = new Set(Array.from({ length: 50 }, () => generateSlug()));
    expect(slugs.size).toBe(50);
  });
});

describe("receiptUrl", () => {
  it("builds a URL with the given base", () => {
    expect(receiptUrl("abc123", "https://example.com")).toBe(
      "https://example.com/receipt/abc123"
    );
  });
});

describe("withUtm", () => {
  it("appends UTM query params", () => {
    const result = withUtm("https://example.com/receipt/x", "twitter");
    expect(result).toContain("utm_source=twitter");
    expect(result).toContain("utm_medium=social");
    expect(result).toContain("utm_campaign=closure-receipt");
  });
});
