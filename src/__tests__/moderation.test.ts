/**
 * Tests for Content Moderation utilities
 *
 * @module __tests__/moderation.test.ts
 */

import { moderateContent, isContentClean } from "@/lib/moderation";

describe("Content Moderation", () => {
  describe("moderateContent()", () => {
    it("returns isClean: true for empty text", () => {
      expect(moderateContent("")).toEqual({ isClean: true });
      expect(moderateContent("   ")).toEqual({ isClean: true });
    });

    it("returns isClean: true for undefined/null", () => {
      expect(moderateContent(undefined as unknown as string)).toEqual({ isClean: true });
      expect(moderateContent(null as unknown as string)).toEqual({ isClean: true });
    });

    it("allows normal closure messages", () => {
      const cleanMessages = [
        "I hope you find happiness",
        "Thank you for the memories",
        "Wishing you well",
        "This was a learning experience",
        "No hard feelings",
        "I've grown from this",
      ];

      cleanMessages.forEach((msg) => {
        expect(moderateContent(msg).isClean).toBe(true);
      });
    });

    it("blocks messages encouraging sending to ex", () => {
      const blocked = [
        "send this to your ex",
        "Send this to them",
        "forward this to your ex",
      ];

      blocked.forEach((msg) => {
        const result = moderateContent(msg);
        expect(result.isClean).toBe(false);
        expect(result.message).toBeDefined();
      });
    });

    it("blocks violent language", () => {
      const blocked = [
        "I want to hurt you",
        "kill yourself",
        "kys",
      ];

      blocked.forEach((msg) => {
        expect(moderateContent(msg).isClean).toBe(false);
      });
    });

    it("blocks extreme profanity directed at person", () => {
      const blocked = [
        "fuck you",
        "fuck off",
      ];

      blocked.forEach((msg) => {
        expect(moderateContent(msg).isClean).toBe(false);
      });
    });

    it("is case insensitive", () => {
      expect(moderateContent("SEND THIS TO YOUR EX").isClean).toBe(false);
      expect(moderateContent("Send This To Your Ex").isClean).toBe(false);
    });

    it("returns appropriate error message", () => {
      const result = moderateContent("send this to your ex");
      expect(result.message).toContain("hurtful");
      expect(result.message).toContain("softer wording");
    });
  });

  describe("isContentClean()", () => {
    it("returns true for clean content", () => {
      expect(isContentClean("I wish you well")).toBe(true);
    });

    it("returns false for flagged content", () => {
      expect(isContentClean("send this to your ex")).toBe(false);
    });
  });
});
