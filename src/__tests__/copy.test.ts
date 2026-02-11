/**
 * Tests for Copy Constants
 *
 * @module __tests__/copy.test.ts
 */

import {
  HERO_LINES,
  CTA_TEXT,
  SHARE_CAPTION,
  RECEIPT_VERDICT,
  RECEIPT_TITLE,
  PDF_FOOTER,
  FOOTER_MICROTEXT,
  FORM_HELPERS,
  VALIDATION,
  A11Y,
  META,
} from "@/lib/copy";

describe("Copy Constants", () => {
  describe("HERO_LINES", () => {
    it("has three lines", () => {
      expect(HERO_LINES.lineA).toBeDefined();
      expect(HERO_LINES.lineB).toBeDefined();
      expect(HERO_LINES.lineC).toBeDefined();
    });

    it("lineC is RECEIPT in caps", () => {
      expect(HERO_LINES.lineC).toBe("RECEIPT.");
    });
  });

  describe("CTA_TEXT", () => {
    it("contains closure keyword", () => {
      expect(CTA_TEXT.toLowerCase()).toContain("closure");
    });
  });

  describe("SHARE_CAPTION (the single best caption)", () => {
    it("matches exact required text", () => {
      expect(SHARE_CAPTION).toBe("No refunds. Just receipts — close the tab and glow up.");
    });

    it("does not encourage contacting ex", () => {
      expect(SHARE_CAPTION.toLowerCase()).not.toContain("send");
      expect(SHARE_CAPTION.toLowerCase()).not.toContain("ex");
      expect(SHARE_CAPTION.toLowerCase()).not.toContain("them");
    });
  });

  describe("RECEIPT_VERDICT", () => {
    it("contains closed without refund", () => {
      expect(RECEIPT_VERDICT.toLowerCase()).toContain("closed");
      expect(RECEIPT_VERDICT.toLowerCase()).toContain("refund");
    });
  });

  describe("RECEIPT_TITLE", () => {
    it("is Closure Receipt", () => {
      expect(RECEIPT_TITLE).toBe("Closure Receipt");
    });
  });

  describe("PDF_FOOTER", () => {
    it("contains domain and tagline", () => {
      expect(PDF_FOOTER.toLowerCase()).toContain("closure");
      expect(PDF_FOOTER.toLowerCase()).toContain("reflection");
    });

    it("does not contain revenge language", () => {
      expect(PDF_FOOTER.toLowerCase()).not.toContain("revenge");
    });
  });

  describe("FOOTER_MICROTEXT", () => {
    it("has tagline and credit", () => {
      expect(FOOTER_MICROTEXT.tagline).toBeDefined();
      expect(FOOTER_MICROTEXT.credit).toBeDefined();
    });
  });

  describe("FORM_HELPERS", () => {
    it("has money spent helper", () => {
      expect(FORM_HELPERS.moneySpent).toContain("No judgement");
    });

    it("has privacy tip", () => {
      expect(FORM_HELPERS.privacyTip).toContain("anonymous");
    });
  });

  describe("VALIDATION", () => {
    it("has abusive content message", () => {
      expect(VALIDATION.abusiveContent).toContain("softer wording");
    });

    it("abusive content message is empathetic", () => {
      expect(VALIDATION.abusiveContent.toLowerCase()).toContain("your closure");
    });
  });

  describe("A11Y", () => {
    it("has slider labels", () => {
      expect(A11Y.emotionalDamageLabel).toBeDefined();
      expect(A11Y.betrayalLabel).toBeDefined();
    });

    it("has slider value announce function", () => {
      expect(A11Y.sliderValueAnnounce(5, 10)).toBe("5 of 10");
    });
  });

  describe("META", () => {
    it("has site title and description", () => {
      expect(META.siteTitle).toBeDefined();
      expect(META.siteDescription).toBeDefined();
    });

    it("uses share caption for OG description", () => {
      expect(META.ogDescription).toBe(SHARE_CAPTION);
    });
  });
});
