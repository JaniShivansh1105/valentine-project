/**
 * Feature Flags Configuration
 *
 * Toggle features on/off for gradual rollout, A/B testing,
 * and safe deployments. Set via environment variables.
 *
 * @module lib/feature-flags
 */

// ─────────────────────────────────────────────────────────────
// FLAG DEFINITIONS
// ─────────────────────────────────────────────────────────────

export const FEATURE_FLAGS = {
  /**
   * Enable the polished hero with three-line headline and animations.
   * Set FEATURE_POLISHED_HERO=true in .env.local to enable.
   */
  POLISHED_HERO: process.env.NEXT_PUBLIC_FEATURE_POLISHED_HERO === "true",

  /**
   * Enable mascot interaction on CTA hover.
   * Set FEATURE_MASCOT_INTERACTION=true in .env.local to enable.
   */
  MASCOT_INTERACTION: process.env.NEXT_PUBLIC_FEATURE_MASCOT_INTERACTION === "true",

  /**
   * Enable embeddable badge widget.
   * Set FEATURE_EMBED_BADGE=true in .env.local to enable.
   */
  EMBED_BADGE: process.env.NEXT_PUBLIC_FEATURE_EMBED_BADGE === "true",

  /**
   * Enable enhanced analytics tracking.
   * Set FEATURE_ANALYTICS=true in .env.local to enable.
   * Defaults to true in production when env var is not set.
   */
  ANALYTICS: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === "true" || 
             (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === undefined),

  /**
   * Enable content moderation on last words field.
   * Set FEATURE_CONTENT_MODERATION=true in .env.local to enable.
   */
  CONTENT_MODERATION: process.env.NEXT_PUBLIC_FEATURE_CONTENT_MODERATION === "true",

  /**
   * Enable the /api/og dynamic OG image endpoint.
   * Set FEATURE_OG_API=true in .env.local to enable.
   * Defaults to true in production when env var is not set.
   */
  OG_API: process.env.NEXT_PUBLIC_FEATURE_OG_API === "true" || 
          (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_FEATURE_OG_API === undefined),

  /**
   * Enable PDF font embedding fixes.
   * Set FEATURE_PDF_FONTS=true in .env.local to enable.
   */
  PDF_FONTS: process.env.NEXT_PUBLIC_FEATURE_PDF_FONTS === "true",

  /**
   * Enable stricter rate limiting (1/min, 10/day per IP).
   * Set FEATURE_STRICT_RATE_LIMIT=true in .env.local to enable.
   */
  STRICT_RATE_LIMIT: process.env.NEXT_PUBLIC_FEATURE_STRICT_RATE_LIMIT === "true",
} as const;

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Check if a feature is enabled.
 * @param flag - The feature flag key
 * @returns boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(
  flag: keyof typeof FEATURE_FLAGS
): boolean {
  return FEATURE_FLAGS[flag] === true;
}

/**
 * Get all enabled features (for debugging/logging).
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([, value]) => value === true)
    .map(([key]) => key);
}
