import type { ReceiptRecord, ReceiptFormData } from "./types";
import { generateSlug } from "./utils";
import { moodFromDamage } from "./mood";

/**
 * Lightweight in-memory datastore for local development.
 *
 * ── Swapping to a persistent store ──
 * Replace this file's exports with calls to your preferred backend:
 *
 * • Vercel KV:
 *     import { kv } from "@vercel/kv";
 *     export async function saveReceipt(data) { await kv.set(`receipt:${slug}`, record); ... }
 *     export async function getReceipt(slug) { return kv.get(`receipt:${slug}`); }
 *
 * • Supabase:
 *     import { createClient } from "@supabase/supabase-js";
 *     const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
 *     export async function saveReceipt(data) { await sb.from("receipts").insert(record); ... }
 *     export async function getReceipt(slug) { const { data } = await sb.from("receipts").select().eq("slug", slug).single(); return data; }
 *
 * The API routes import only `saveReceipt` and `getReceipt`, so the swap is a single-file change.
 */

// Use globalThis to persist across hot-module reloads in dev.
// In production this is a plain in-memory map (cleared on cold start).
const globalStore = globalThis as unknown as { __receiptStore?: Map<string, ReceiptRecord> };
if (!globalStore.__receiptStore) {
  globalStore.__receiptStore = new Map<string, ReceiptRecord>();
}
const store = globalStore.__receiptStore;

/**
 * Persist a new receipt and return its slug.
 */
export async function saveReceipt(data: ReceiptFormData): Promise<string> {
  const slug = generateSlug();
  const record: ReceiptRecord = {
    ...data,
    slug,
    createdAt: new Date().toISOString(),
    moodPreset: moodFromDamage(data.emotionalDamage),
  };
  store.set(slug, record);
  return slug;
}

/**
 * Retrieve a receipt by slug. Returns null if not found.
 */
export async function getReceipt(slug: string): Promise<ReceiptRecord | null> {
  return store.get(slug) ?? null;
}
