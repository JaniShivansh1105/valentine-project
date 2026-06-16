import { receiptUrl, withUtm } from "@/lib/utils";

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
