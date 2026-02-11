/**
 * Shared TypeScript types for the Closure Receipt app.
 */

export interface ReceiptFormData {
  yourName: string;
  partnerName: string;
  timeInvested: number;
  moneySpent: number;
  emotionalDamage: number;
  betrayalLevel: number;
  note: string;
  anonymous: boolean;
  tone: TonePreset;
}

export interface ReceiptRecord extends ReceiptFormData {
  slug: string;
  createdAt: string;
  moodPreset: MoodPreset;
}

/** 0–2 calm, 3–5 reflective, 6–8 spicy, 9–10 nuclear */
export type MoodPreset = "calm" | "reflective" | "spicy" | "nuclear";

/** User-chosen tone for microcopy */
export type TonePreset = "wry" | "bitter" | "cathartic";

export interface CreateReceiptResponse {
  slug: string;
  url: string;
}

export interface MoodTheme {
  preset: MoodPreset;
  label: string;
  accent: string;        // CSS hex
  accentLight: string;
  mascot: "calm" | "side-eye" | "dead-inside";
  microcopy: string;     // Short label for the mood
  closingLine: string;   // Empathetic closing line
}
