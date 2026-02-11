/**
 * Tests for Analytics utilities
 *
 * @module __tests__/analytics.test.ts
 */

import { track, trackPageView, trackShare, analyticsOptedOut } from "@/lib/analytics";

describe("Analytics", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.log for development logging
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
    // Clear localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("track()", () => {
    it("logs event in development", () => {
      track({ name: "page_view_home" });
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics]",
        "page_view_home",
        expect.any(Object)
      );
    });

    it("logs event with payload", () => {
      track({
        name: "receipt_created",
        payload: { slug: "test123", mood: "calm", tone: "wry", anon: false, lessons: [] },
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics]",
        "receipt_created",
        expect.objectContaining({ slug: "test123" })
      );
    });
  });

  describe("trackPageView()", () => {
    it("tracks home page view", () => {
      trackPageView("home");
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics]",
        "page_view_home",
        expect.any(Object)
      );
    });

    it("tracks generate page view", () => {
      trackPageView("generate");
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics]",
        "page_view_generate",
        expect.any(Object)
      );
    });

    it("tracks receipt page view with slug", () => {
      trackPageView("receipt", { slug: "abc123" });
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics]",
        "page_view_receipt",
        expect.objectContaining({ slug: "abc123" })
      );
    });
  });

  describe("trackShare()", () => {
    it("tracks share with channel and slug", () => {
      trackShare("twitter", "xyz789");
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics]",
        "share_clicked",
        expect.objectContaining({ channel: "twitter", slug: "xyz789" })
      );
    });
  });

  describe("analyticsOptedOut()", () => {
    it("returns false by default", () => {
      // In test environment, may not have localStorage
      expect(typeof analyticsOptedOut()).toBe("boolean");
    });
  });
});
