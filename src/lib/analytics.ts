/**
 * Analytics Instrumentation Layer
 *
 * This module provides a unified interface for tracking events.
 * The project owner can swap GA4 / Mixpanel / PostHog by changing
 * the `send` implementation below.
 *
 * Events are only fired if analytics is not opted-out.
 *
 * @module lib/analytics
 */

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | { name: "page_view_home" }
  | { name: "page_view_generate" }
  | { name: "page_view_receipt"; payload: { slug: string } }
  | { name: "generate_receipt_clicked" }
  | { name: "receipt_created"; payload: ReceiptCreatedPayload }
  | { name: "pdf_downloaded"; payload: { slug: string } }
  | { name: "share_clicked"; payload: { channel: string; slug: string } }
  | { name: "badge_generated"; payload: { slug: string } }
  | { name: "report_submitted"; payload: { slug: string } };

interface ReceiptCreatedPayload {
  slug: string;
  mood: string;
  tone: string;
  anon: boolean;
  lessons: string[];
}

// ─────────────────────────────────────────────────────────────
// OPT-OUT CHECK
// ─────────────────────────────────────────────────────────────

/**
 * Check if user has opted out of analytics.
 * - URL param `?analytics=0` sets opt-out
 * - localStorage `optOutAnalytics = 'true'` persists opt-out
 */
function isOptedOut(): boolean {
  if (typeof window === "undefined") return false;

  // Check URL param
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("analytics") === "0") {
      localStorage.setItem("optOutAnalytics", "true");
      return true;
    }
  } catch {
    // URL parsing failed, continue
  }

  // Check localStorage
  try {
    return localStorage.getItem("optOutAnalytics") === "true";
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// SEND IMPLEMENTATION
// Swap this function body to integrate your analytics provider.
// ─────────────────────────────────────────────────────────────

/**
 * Send event to analytics provider.
 *
 * Example GA4 integration:
 * ```ts
 * if (typeof gtag !== 'undefined') {
 *   gtag('event', name, payload ?? {});
 * }
 * ```
 *
 * Example Mixpanel:
 * ```ts
 * mixpanel.track(name, payload ?? {});
 * ```
 */
function send(name: string, payload?: Record<string, unknown>): void {
  // Log to console in development and test environments
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    console.log("[Analytics]", name, payload ?? {});
  }

  // GA4 / gtag (uncomment when ready)
  // if (typeof window !== "undefined" && (window as any).gtag) {
  //   (window as any).gtag("event", name, payload ?? {});
  // }

  // Mixpanel (uncomment when ready)
  // if (typeof window !== "undefined" && (window as any).mixpanel) {
  //   (window as any).mixpanel.track(name, payload ?? {});
  // }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * Track an analytics event.
 * Respects user opt-out preferences.
 */
export function track(event: AnalyticsEvent): void {
  if (isOptedOut()) return;

  const { name, ...rest } = event as AnalyticsEvent & { payload?: Record<string, unknown> };
  const payload = "payload" in rest ? rest.payload : undefined;

  send(name, payload as Record<string, unknown> | undefined);
}

/**
 * Helper to track page views with consistent naming.
 */
export function trackPageView(
  page: "home" | "generate" | "receipt",
  meta?: { slug?: string }
): void {
  if (page === "home") track({ name: "page_view_home" });
  else if (page === "generate") track({ name: "page_view_generate" });
  else if (page === "receipt" && meta?.slug) {
    track({ name: "page_view_receipt", payload: { slug: meta.slug } });
  }
}

/**
 * Helper for share tracking with UTM-aware channels.
 */
export function trackShare(channel: string, slug: string): void {
  track({ name: "share_clicked", payload: { channel, slug } });
}

/**
 * Check opt-out status (useful for conditional rendering).
 */
export function analyticsOptedOut(): boolean {
  return isOptedOut();
}
