/**
 * Closure Receipt — Standardised Copy Kit
 *
 * All user-facing copy lives here for easy editing, translation,
 * and consistency across the app. Uses British English spelling.
 *
 * @module lib/copy
 */

// ─────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────

/** Hero headline split into three lines for screenshot-perfect styling */
export const HERO_LINES = {
  lineA: "Turn your",
  lineB: "breakup into a",
  lineC: "RECEIPT.",
} as const;

/** Call-to-action button text */
export const CTA_TEXT = "Create my closure →" as const;

/** Alternative CTA for form submit */
export const GENERATE_CTA = "Generate receipt" as const;

// ─────────────────────────────────────────────────────────────
// SHARE CAPTION (THE SINGLE BEST CAPTION)
// ─────────────────────────────────────────────────────────────

/**
 * The one perfect social caption — use verbatim for pre-filled shares.
 * No refunds. Just receipts — close the tab and glow up.
 */
export const SHARE_CAPTION = "No refunds. Just receipts — close the tab and glow up." as const;

// ─────────────────────────────────────────────────────────────
// RECEIPT
// ─────────────────────────────────────────────────────────────

/** Verdict banner on receipts */
export const RECEIPT_VERDICT = "Final status: Closed without refund" as const;

/** Receipt title */
export const RECEIPT_TITLE = "Closure Receipt" as const;

/** PDF footer watermark */
export const PDF_FOOTER = "closurereceipt.in — Built for reflection" as const;

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────

export const FOOTER_MICROTEXT = {
  tagline: "Built for reflection, not revenge.",
  credit: "Created by Shivansh Jani",
} as const;

// ─────────────────────────────────────────────────────────────
// FORM HELPERS
// ─────────────────────────────────────────────────────────────

export const FORM_HELPERS = {
  moneySpent: "No judgement. Only maths — enter whole numbers.",
  lastWords: "Say what you never said. Or don't.",
  refundPolicy: "Refund policy: absolutely not",
  deliveryTime: "Closure delivery time: varies. Replies: not included.",
  privacyTip: "Tip: Receipts are public by default. Toggle anonymous mode to hide your name.",
} as const;

// ─────────────────────────────────────────────────────────────
// VALIDATION MESSAGES
// ─────────────────────────────────────────────────────────────

export const VALIDATION = {
  partnerRequired: "Please enter their name or nickname.",
  timeRequired: "Time invested must be at least 1 month.",
  abusiveContent:
    "Your message contains words that could be hurtful. Consider softer wording — this is about your closure, not theirs.",
  rateLimited: "Too many requests. Please wait a moment and try again.",
  genericError: "Something went wrong. Please try again.",
} as const;

// ─────────────────────────────────────────────────────────────
// ACCESSIBILITY
// ─────────────────────────────────────────────────────────────

export const A11Y = {
  emotionalDamageLabel: "Emotional damage level",
  betrayalLabel: "Betrayal level",
  sliderValueAnnounce: (value: number, max: number) => `${value} of ${max}`,
} as const;

// ─────────────────────────────────────────────────────────────
// EMBED / BADGE
// ─────────────────────────────────────────────────────────────

export const EMBED = {
  badgeTitle: "Love Is Pain Badge",
  badgeAlt: "Closure Receipt verification badge",
  embedSnippetLabel: "Embed this badge on your site:",
} as const;

// ─────────────────────────────────────────────────────────────
// REPORT FLOW
// ─────────────────────────────────────────────────────────────

export const REPORT = {
  submitted: "Report submitted. We'll review this receipt.",
  reason: "Why are you reporting this receipt?",
} as const;

// ─────────────────────────────────────────────────────────────
// METADATA / OG
// ─────────────────────────────────────────────────────────────

export const META = {
  siteTitle: "Closure Receipt — Close the tab, keep the glow",
  siteDescription: "Turn your breakup into a receipt. Share it, download it, and move on.",
  ogTitle: "Closure Receipt",
  ogDescription: SHARE_CAPTION,
} as const;
