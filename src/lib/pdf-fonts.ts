/**
 * PDF Font Embedding Utilities
 *
 * Ensures Poppins ExtraBold is embedded in PDF exports
 * when using html2pdf.js or similar client-side PDF generators.
 *
 * @module lib/pdf-fonts
 */

// ─────────────────────────────────────────────────────────────
// FONT FACE DECLARATIONS
// For PDF export, we inject these into the print container.
// ─────────────────────────────────────────────────────────────

/**
 * CSS @font-face declaration for Poppins ExtraBold.
 * Uses a relative path to the fonts directory.
 *
 * To use with local fonts, place the .woff2 file at:
 * public/fonts/Poppins-ExtraBold.woff2
 */
export const POPPINS_FONT_FACE = `
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url('/fonts/Poppins-ExtraBold.woff2') format('woff2');
}

@font-face {
  font-family: 'Poppins-ExtraBold';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url('/fonts/Poppins-ExtraBold.woff2') format('woff2');
}
`.trim();

/**
 * Additional print styles for PDF export.
 */
export const PDF_PRINT_STYLES = `
@media print {
  /* Set page size and very tight margins */
  @page {
    size: A4;
    margin: 0.3in 0.4in 0.2in 0.4in;
  }

  /* Make everything much smaller */
  body {
    font-size: 11px !important;
    line-height: 1.2 !important;
  }

  /* Hide non-printable elements */
  .no-print,
  [data-no-print] {
    display: none !important;
  }

  /* Ensure proper page breaks - force single page */
  .receipt-card {
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }

  /* Aggressively scale down the entire receipt container */
  .flex.w-full.max-w-xl.flex-col.items-center.gap-6 {
    transform: scale(0.75) !important;
    transform-origin: top center !important;
    gap: 4px !important;
    max-width: 100% !important;
    width: 100% !important;
  }

  /* Compact main heading */
  .receipt-heading,
  [data-pdf-heading] {
    font-family: 'Poppins', 'Poppins-ExtraBold', system-ui, sans-serif !important;
    font-weight: 800 !important;
    font-size: 14px !important;
    margin-bottom: 2px !important;
    line-height: 1.1 !important;
  }

  /* Very compact card header */
  [class*="CardHeader"] {
    padding: 8px 12px !important;
  }

  /* Card header title */
  [class*="CardTitle"] {
    font-size: 20px !important;
    margin-bottom: 2px !important;
  }

  /* Card header description */
  [class*="CardDescription"] {
    font-size: 12px !important;
  }

  /* Very compact card content */
  [class*="CardContent"] {
    padding: 12px !important;
    gap: 8px !important;
  }

  /* Very compact card footer */
  [class*="CardFooter"] {
    padding: 4px 12px !important;
    font-size: 8px !important;
  }

  /* Reduce all flex gaps */
  .flex.flex-col.gap-6 {
    gap: 3px !important;
  }

  .flex.flex-col.gap-5 {
    gap: 6px !important;
  }

  .flex.flex-col.gap-1 {
    gap: 1px !important;
  }

  /* Very compact line items */
  .divide-y > li {
    padding-top: 3px !important;
    padding-bottom: 3px !important;
    font-size: 11px !important;
  }

  .divide-y {
    font-size: 11px !important;
  }

  /* Ultra compact lessons learned */
  ul.flex.flex-wrap.gap-2 {
    gap: 2px !important;
    margin: 4px 0 !important;
  }

  ul.flex.flex-wrap.gap-2 li {
    padding: 2px 6px !important;
    font-size: 9px !important;
  }

  /* Compact section headers */
  h3.mb-2.text-sm.font-semibold {
    font-size: 10px !important;
    margin-bottom: 3px !important;
  }

  /* Very compact blockquote */
  blockquote {
    font-size: 10px !important;
    padding-left: 8px !important;
    margin: 4px 0 !important;
    line-height: 1.2 !important;
  }

  /* Much smaller mascot */
  .h-16.w-16 {
    height: 32px !important;
    width: 32px !important;
  }

  /* Compact timestamp and receipt number */
  .text-xs {
    font-size: 8px !important;
  }

  .text-sm {
    font-size: 9px !important;
  }

  .text-base {
    font-size: 11px !important;
  }

  /* Compact author and other small text */
  p.text-sm.text-neutral-400 {
    font-size: 9px !important;
    margin: 2px 0 !important;
  }

  /* Compact playlist link */
  a.inline-flex.items-center {
    font-size: 8px !important;
    margin: 2px 0 !important;
  }

  /* Compact closing line */
  p.text-base.font-medium {
    font-size: 10px !important;
    margin: 3px 0 !important;
  }

  /* Force colour printing */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Remove shadows for cleaner print */
  .shadow,
  .shadow-sm,
  .shadow-md,
  .shadow-lg {
    box-shadow: none !important;
  }

  /* Additional space reduction */
  .animate-float {
    animation: none !important;
  }

  /* Ensure tight container */
  .max-w-xl {
    max-width: 100% !important;
    width: 100% !important;
  }

  /* Remove any extra margins from motion components */
  [style*="--framer-"] {
    margin: 0 !important;
  }
}
`.trim();

// ─────────────────────────────────────────────────────────────
// INJECTION HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Create a style element with font-face and print styles.
 * Inject this into the document before PDF generation.
 *
 * @example
 * const style = createPdfFontStyle();
 * document.head.appendChild(style);
 * // ... generate PDF ...
 * style.remove();
 */
export function createPdfFontStyle(): HTMLStyleElement {
  const style = document.createElement("style");
  style.id = "pdf-font-embed";
  style.textContent = `${POPPINS_FONT_FACE}\n${PDF_PRINT_STYLES}`;
  return style;
}

/**
 * Inject font styles, execute callback, then cleanup.
 * Useful for wrapping PDF generation.
 *
 * @example
 * await withPdfFonts(async () => {
 *   await html2pdf().from(element).save();
 * });
 */
export async function withPdfFonts<T>(
  callback: () => T | Promise<T>
): Promise<T> {
  const style = createPdfFontStyle();
  document.head.appendChild(style);

  try {
    return await callback();
  } finally {
    style.remove();
  }
}

/**
 * Get the complete CSS string for PDF embedding.
 * Use this if you need to manually inject styles.
 */
export function getPdfFontCss(): string {
  return `${POPPINS_FONT_FACE}\n${PDF_PRINT_STYLES}`;
}

// ─────────────────────────────────────────────────────────────
// html2pdf.js OPTIONS HELPER
// ─────────────────────────────────────────────────────────────

/**
 * Recommended html2pdf options for best font rendering.
 *
 * @example
 * import html2pdf from 'html2pdf.js';
 *
 * html2pdf()
 *   .set(getHtml2PdfOptions('closure-receipt'))
 *   .from(element)
 *   .save();
 */
export function getHtml2PdfOptions(filename: string = "receipt") {
  return {
    margin: [10, 10, 10, 10],
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    // Enable font embedding
    enableLinks: true,
  };
}

// ─────────────────────────────────────────────────────────────
// PUPPETEER/SERVER-SIDE HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * CSS to inject into Puppeteer page before pdf() call.
 * Use with page.addStyleTag({ content: getPuppeteerPdfCss() })
 */
export function getPuppeteerPdfCss(): string {
  return `
${POPPINS_FONT_FACE}

body {
  font-family: 'Inter', system-ui, sans-serif;
}

.receipt-heading,
h1, h2, h3 {
  font-family: 'Poppins', system-ui, sans-serif !important;
  font-weight: 800 !important;
}

* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
`.trim();
}
