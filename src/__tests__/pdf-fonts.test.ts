/**
 * Tests for PDF Font Embedding utilities
 *
 * @module __tests__/pdf-fonts.test.ts
 */

import {
  POPPINS_FONT_FACE,
  PDF_PRINT_STYLES,
  getPdfFontCss,
} from "@/lib/pdf-fonts";

describe("PDF Fonts Utilities", () => {
  describe("POPPINS_FONT_FACE", () => {
    it("contains @font-face declaration", () => {
      expect(POPPINS_FONT_FACE).toContain("@font-face");
    });

    it("references Poppins font family", () => {
      expect(POPPINS_FONT_FACE).toContain("Poppins");
    });

    it("specifies font weight 800", () => {
      expect(POPPINS_FONT_FACE).toContain("800");
    });

    it("references woff2 format", () => {
      expect(POPPINS_FONT_FACE).toContain("woff2");
    });

    it("points to correct font path", () => {
      expect(POPPINS_FONT_FACE).toContain("/fonts/Poppins-ExtraBold.woff2");
    });
  });

  describe("PDF_PRINT_STYLES", () => {
    it("contains @media print rule", () => {
      expect(PDF_PRINT_STYLES).toContain("@media print");
    });

    it("targets receipt-heading class", () => {
      expect(PDF_PRINT_STYLES).toContain(".receipt-heading");
    });

    it("enables print colour adjust", () => {
      expect(PDF_PRINT_STYLES).toContain("print-color-adjust");
    });

    it("hides no-print elements", () => {
      expect(PDF_PRINT_STYLES).toContain(".no-print");
      expect(PDF_PRINT_STYLES).toContain("display: none");
    });
  });

  describe("getPdfFontCss()", () => {
    it("returns combined font and print styles", () => {
      const css = getPdfFontCss();
      expect(css).toContain("@font-face");
      expect(css).toContain("@media print");
    });
  });

});
