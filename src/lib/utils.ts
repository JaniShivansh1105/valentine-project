import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a short, URL-friendly slug from a UUID.
 */
export function generateSlug(): string {
  // Use crypto for a short random slug (8 chars, base36)
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  const array = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 8; i++) array[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < 8; i++) {
    slug += chars[array[i] % chars.length];
  }
  return slug;
}

/**
 * Build the full public URL for a receipt.
 */
export function receiptUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${base}/receipt/${slug}`;
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
