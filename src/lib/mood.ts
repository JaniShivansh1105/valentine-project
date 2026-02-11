import type { MoodPreset, MoodTheme, TonePreset } from "./types";

/**
 * Mood themes — colour accent, mascot expression, and microcopy driven by emotional damage.
 *
 * 0–2 → calm       (sage green, neutral smile)
 * 3–5 → reflective (amber, side-eye)
 * 6–8 → spicy      (mauve/violet, dead-inside)
 * 9–10 → nuclear   (red, dead-inside intense)
 *
 * ── To change colours or copy, edit the objects below. ──
 */

const themes: Record<MoodPreset, MoodTheme> = {
  calm: {
    preset: "calm",
    label: "Calm",
    accent: "#7fbf9b",
    accentLight: "#e6f5ec",
    mascot: "calm",
    microcopy: "Peaceful ending. No drama needed.",
    closingLine: "Take a breath. Better days are coming.",
  },
  reflective: {
    preset: "reflective",
    label: "Reflective",
    accent: "#f59e0b",
    accentLight: "#fef3c7",
    mascot: "side-eye",
    microcopy: "A little crispy around the edges.",
    closingLine: "Growth looks good on you.",
  },
  spicy: {
    preset: "spicy",
    label: "Spicy",
    accent: "#a78bfa",
    accentLight: "#ede9fe",
    mascot: "dead-inside",
    microcopy: "Feelings: fully loaded.",
    closingLine: "You'll come back stronger.",
  },
  nuclear: {
    preset: "nuclear",
    label: "Nuclear",
    accent: "#ef4444",
    accentLight: "#fef2f2",
    mascot: "dead-inside",
    microcopy: "Maximum damage. Full send.",
    closingLine: "You survived the worst. You win.",
  },
};

/** Derive mood preset from emotional damage slider (0–10). */
export function moodFromDamage(emotionalDamage: number): MoodPreset {
  if (emotionalDamage <= 2) return "calm";
  if (emotionalDamage <= 5) return "reflective";
  if (emotionalDamage <= 8) return "spicy";
  return "nuclear";
}

/** Get the full mood theme object. */
export function getMoodTheme(preset: MoodPreset): MoodTheme {
  return themes[preset];
}

/** Derive "lessons learned" tags based on inputs. */
export function deriveLessons(emotionalDamage: number, betrayalLevel: number): string[] {
  const lessons: string[] = [];

  if (emotionalDamage >= 7) lessons.push("Ignored red flags (never again)");
  if (emotionalDamage >= 4) lessons.push("Raised your standards");
  if (betrayalLevel >= 3) lessons.push("Learnt silence is an answer");
  if (betrayalLevel >= 1) lessons.push("Better choices next time");
  if (emotionalDamage <= 3) lessons.push("Mistook effort for compatibility");

  if (lessons.length < 2) {
    lessons.push("Self-worth restored");
    lessons.push("Ready to move on");
  }

  return lessons.slice(0, 4);
}

/** Build a subtitle line for the receipt. */
export function buildSubtitle(timeMonths: number, moneySpent: number): string {
  const timePart =
    timeMonths >= 12
      ? `${Math.floor(timeMonths / 12)} year${Math.floor(timeMonths / 12) !== 1 ? "s" : ""}${timeMonths % 12 ? ` ${timeMonths % 12} mo` : ""}`
      : `${timeMonths} month${timeMonths !== 1 ? "s" : ""}`;

  const moneyPart = moneySpent > 0 ? ` · ₹${moneySpent.toLocaleString("en-IN")} spent` : "";

  return `${timePart} invested${moneyPart} · No refund issued`;
}

/** Tone-specific microcopy for the receipt closing. */
export function toneLine(tone: TonePreset, emotionalDamage: number): string {
  const lines: Record<TonePreset, string[]> = {
    wry: [
      "Closing this account. Thanks for the memories (most of them).",
      "Transaction complete. Balance transferred to self-respect.",
      "Filed under: lessons that cost money.",
    ],
    bitter: [
      "No refunds. No exchanges. No regrets.",
      "Balance due: zero. Interest lost: all of it.",
      "This invoice is final. Do not reply.",
    ],
    cathartic: [
      "Letting go doesn't mean giving up — it means growing up.",
      "This receipt is your permission to move forward.",
      "Closed with grace. Open to whatever's next.",
    ],
  };
  const idx = emotionalDamage <= 3 ? 0 : emotionalDamage <= 7 ? 1 : 2;
  return lines[tone][idx];
}

/** Map emotional damage to a placeholder Spotify playlist link. */
export function closurePlaylist(emotionalDamage: number): { label: string; url: string } {
  if (emotionalDamage <= 3) {
    return { label: "Chill Closure Vibes", url: "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6" };
  }
  if (emotionalDamage <= 6) {
    return { label: "Reflective Rainy Day", url: "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1" };
  }
  return { label: "Scorched Earth Anthems", url: "https://open.spotify.com/playlist/37i9dQZF1DWTwnEm1IYyoj" };
}
