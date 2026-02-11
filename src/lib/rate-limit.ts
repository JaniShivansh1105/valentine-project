/**
 * Rate Limiter with Feature Flag Support
 *
 * Provides two modes:
 * - Standard: 10 requests per minute per IP
 * - Strict: 1 request per minute, 10 requests per day per IP
 *
 * Enable strict mode via FEATURE_STRICT_RATE_LIMIT feature flag.
 *
 * @module lib/rate-limit
 */

import { FEATURE_FLAGS } from "./feature-flags";

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────

const STANDARD_WINDOW_MS = 60_000;      // 1 minute
const STANDARD_MAX_REQUESTS = 10;       // per minute

const STRICT_WINDOW_MS = 60_000;        // 1 minute
const STRICT_MAX_PER_MINUTE = 1;        // 1 per minute
const STRICT_DAILY_MAX = 10;            // 10 per day
const DAY_MS = 24 * 60 * 60 * 1000;

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface StrictRateLimitEntry {
  minuteCount: number;
  minuteResetAt: number;
  dailyCount: number;
  dailyResetAt: number;
}

const standardHits = new Map<string, RateLimitEntry>();
const strictHits = new Map<string, StrictRateLimitEntry>();

// ─────────────────────────────────────────────────────────────
// STANDARD RATE LIMITER
// ─────────────────────────────────────────────────────────────

function isStandardRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = standardHits.get(ip);

  if (!entry || now > entry.resetAt) {
    standardHits.set(ip, { count: 1, resetAt: now + STANDARD_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > STANDARD_MAX_REQUESTS;
}

// ─────────────────────────────────────────────────────────────
// STRICT RATE LIMITER (1/min, 10/day)
// ─────────────────────────────────────────────────────────────

function isStrictRateLimited(ip: string): boolean {
  const now = Date.now();
  let entry = strictHits.get(ip);

  // Initialise or reset entry
  if (!entry) {
    entry = {
      minuteCount: 0,
      minuteResetAt: now + STRICT_WINDOW_MS,
      dailyCount: 0,
      dailyResetAt: now + DAY_MS,
    };
    strictHits.set(ip, entry);
  }

  // Reset minute window if expired
  if (now > entry.minuteResetAt) {
    entry.minuteCount = 0;
    entry.minuteResetAt = now + STRICT_WINDOW_MS;
  }

  // Reset daily window if expired
  if (now > entry.dailyResetAt) {
    entry.dailyCount = 0;
    entry.dailyResetAt = now + DAY_MS;
  }

  // Check daily limit first
  if (entry.dailyCount >= STRICT_DAILY_MAX) {
    return true;
  }

  // Check minute limit
  if (entry.minuteCount >= STRICT_MAX_PER_MINUTE) {
    return true;
  }

  // Increment counters
  entry.minuteCount += 1;
  entry.dailyCount += 1;

  return false;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * Check if an IP is rate limited.
 * Uses strict mode if FEATURE_STRICT_RATE_LIMIT is enabled.
 *
 * @param ip - The IP address to check
 * @returns true if rate limited, false otherwise
 */
export function isRateLimited(ip: string): boolean {
  if (FEATURE_FLAGS.STRICT_RATE_LIMIT) {
    return isStrictRateLimited(ip);
  }
  return isStandardRateLimited(ip);
}

/**
 * Get rate limit info for error messages.
 */
export function getRateLimitInfo(): { mode: "standard" | "strict"; limits: string } {
  if (FEATURE_FLAGS.STRICT_RATE_LIMIT) {
    return {
      mode: "strict",
      limits: `${STRICT_MAX_PER_MINUTE} per minute, ${STRICT_DAILY_MAX} per day`,
    };
  }
  return {
    mode: "standard",
    limits: `${STANDARD_MAX_REQUESTS} per minute`,
  };
}
