/**
 * Tests for PDF Font Embedding utilities
 *
 * @module __tests__/pdf-fonts.test.ts
 */

import {
  POPPINS_FONT_FACE,
  PDF_PRINT_STYLES,
  getPdfFontCss,
  getHtml2PdfOptions,
  getPuppeteerPdfCss,
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

  describe("getHtml2PdfOptions()", () => {
    it("returns object with expected properties", () => {
      const options = getHtml2PdfOptions("test-receipt");

      expect(options).toHaveProperty("margin");
      expect(options).toHaveProperty("filename", "test-receipt.pdf");
      expect(options).toHaveProperty("image");
      expect(options).toHaveProperty("html2canvas");
      expect(options).toHaveProperty("jsPDF");
    });

    it("uses default filename when not provided", () => {
      const options = getHtml2PdfOptions();
      expect(options.filename).toBe("receipt.pdf");
    });

    it("configures html2canvas with scale 2", () => {
      const options = getHtml2PdfOptions();
      expect(options.html2canvas.scale).toBe(2);
    });

    it("configures A4 portrait orientation", () => {
      const options = getHtml2PdfOptions();
      expect(options.jsPDF.format).toBe("a4");
      expect(options.jsPDF.orientation).toBe("portrait");
    });
  });

  describe("getPuppeteerPdfCss()", () => {
    it("returns CSS string with font-face", () => {
      const css = getPuppeteerPdfCss();
      expect(css).toContain("@font-face");
    });

    it("sets Poppins for headings", () => {
      const css = getPuppeteerPdfCss();
      expect(css).toContain("Poppins");
      expect(css).toContain("font-weight: 800");
    });

    it("includes print colour adjust", () => {
      const css = getPuppeteerPdfCss();
      expect(css).toContain("print-color-adjust: exact");
    });
  });
});
