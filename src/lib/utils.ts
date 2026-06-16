import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Build the full public URL for a receipt.
 */
export function receiptUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${base}/receipt/${slug}`;
}

/**
 * Generate a canonical display receipt number.
 * Format: CR-{YYYY}-{MM}-{DD}-{SLUG_PREFIX}
 * Single source of truth — used on the receipt card, OG image, and embed badge.
 */
export function receiptNumber(slug: string, createdAt: string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hash = slug.slice(0, 4).toUpperCase();
  return `CR-${year}-${month}-${day}-${hash}`;
}

/**
 * Append UTM params for share tracking.
 */
export function withUtm(url: string, source: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", "closure-receipt");
  return u.toString();
}
