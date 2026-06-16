/**
 * Rate Limiter with Feature Flag Support (MongoDB Backed)
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
import clientPromise from "./mongodb";

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
// STORAGE INTERFACES
// ─────────────────────────────────────────────────────────────

interface RateLimitEntry {
  _id: string;
  count: number;
  resetAt: number;
}

interface StrictRateLimitEntry {
  _id: string;
  minuteCount: number;
  minuteResetAt: number;
  dailyCount: number;
  dailyResetAt: number;
}

// ─────────────────────────────────────────────────────────────
// STANDARD RATE LIMITER
// ─────────────────────────────────────────────────────────────

async function isStandardRateLimited(ip: string): Promise<boolean> {
  const now = Date.now();
  const client = await clientPromise;
  const db = client.db("closureDB");
  const collection = db.collection<RateLimitEntry>("rateLimits");

  const doc = await collection.findOne({ _id: `std_${ip}` });

  if (!doc || now > doc.resetAt) {
    await collection.updateOne(
      { _id: `std_${ip}` },
      { $set: { count: 1, resetAt: now + STANDARD_WINDOW_MS } },
      { upsert: true }
    );
    return false;
  }

  await collection.updateOne(
    { _id: `std_${ip}` },
    { $inc: { count: 1 } }
  );

  return doc.count >= STANDARD_MAX_REQUESTS;
}

// ─────────────────────────────────────────────────────────────
// STRICT RATE LIMITER (1/min, 10/day)
// ─────────────────────────────────────────────────────────────

async function isStrictRateLimited(ip: string): Promise<boolean> {
  const now = Date.now();
  const client = await clientPromise;
  const db = client.db("closureDB");
  const collection = db.collection<StrictRateLimitEntry>("strictRateLimits");

  let doc = await collection.findOne({ _id: `strict_${ip}` });

  if (!doc) {
    const newDoc: StrictRateLimitEntry = {
      _id: `strict_${ip}`,
      minuteCount: 0,
      minuteResetAt: now + STRICT_WINDOW_MS,
      dailyCount: 0,
      dailyResetAt: now + DAY_MS,
    };
    await collection.insertOne(newDoc);
    doc = newDoc;
  }

  const updates: Partial<StrictRateLimitEntry> = {};
  
  if (now > doc.minuteResetAt) {
    doc.minuteCount = 0;
    updates.minuteResetAt = now + STRICT_WINDOW_MS;
  }
  
  if (now > doc.dailyResetAt) {
    doc.dailyCount = 0;
    updates.dailyResetAt = now + DAY_MS;
  }

  if (doc.dailyCount >= STRICT_DAILY_MAX) return true;
  if (doc.minuteCount >= STRICT_MAX_PER_MINUTE) return true;

  updates.minuteCount = doc.minuteCount + 1;
  updates.dailyCount = doc.dailyCount + 1;

  await collection.updateOne(
    { _id: `strict_${ip}` },
    { $set: updates }
  );

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
export async function isRateLimited(ip: string): Promise<boolean> {
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
