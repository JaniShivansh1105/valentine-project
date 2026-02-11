/**
 * Content Moderation Utilities
 *
 * Simple client-side content filtering to prevent abusive language
 * in the "last words" field. This is NOT a comprehensive filter —
 * it catches obvious cases to maintain a supportive tone.
 *
 * @module lib/moderation
 */

import { VALIDATION } from "./copy";

// ─────────────────────────────────────────────────────────────
// BANNED WORDS LIST (non-exhaustive, case-insensitive)
// These are words/phrases that could enable harassment.
// ─────────────────────────────────────────────────────────────

const BANNED_PATTERNS: RegExp[] = [
  // Direct threats or violent language
  /\b(kill|murder|hurt|harm|attack|stalk)\s*(you|them|her|him|yourself)\b/i,
  /\b(want|going)\s*to\s*(kill|hurt|harm)\s*(you|them|her|him)\b/i,
  /\bkill\s*yourself\b/i,
  /\bdie\b/i,
  /\bkys\b/i,

  // Slurs and hate speech (abbreviated to avoid offense)
  /\b(b[i!1]tch|wh[o0]re|sl[u\*]t|c[u\*]nt)\b/i,

  // Harassment encouragement - send/forward patterns
  /\bsend\s*(this\s*)?(to|2)\s*(your|ur|my)?\s*(ex|them|her|him)\b/i,
  /\bforward\s*(this\s*)?(to|2)\s*(your|ur|my)?\s*(ex|them|her|him)\b/i,

  // Personal info requests
  /\b(address|phone\s*number|where\s*(do\s*)?(you|they)\s*live)\b/i,

  // Extreme profanity combinations
  /f+[u\*]+c+k+\s*(you|off|yourself)/i,
];

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

export interface ModerationResult {
  isClean: boolean;
  message?: string;
}

/**
 * Check if text contains banned/abusive content.
 *
 * @param text - The text to check (e.g., "last words" field)
 * @returns Object with isClean boolean and optional message
 *
 * @example
 * const result = moderateContent("Hope you find peace");
 * // { isClean: true }
 *
 * const result2 = moderateContent("send this to your ex");
 * // { isClean: false, message: "Your message contains..." }
 */
export function moderateContent(text: string): ModerationResult {
  if (!text || typeof text !== "string") {
    return { isClean: true };
  }

  const normalised = text.trim().toLowerCase();

  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(normalised)) {
      return {
        isClean: false,
        message: VALIDATION.abusiveContent,
      };
    }
  }

  return { isClean: true };
}

/**
 * Quick boolean check for form validation.
 */
export function isContentClean(text: string): boolean {
  return moderateContent(text).isClean;
}
