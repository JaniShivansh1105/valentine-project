import type { TonePreset } from "./types";

/**
 * Spotify playlist URLs categorized by emotional state.
 * These are public curated playlists.
 */
const PLAYLISTS = {
  sad: [
    "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1",
    "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634",
  ],
  healing: [
    "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JBER9z9",
    "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
  ],
  reflective: [
    "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6",
    "https://open.spotify.com/playlist/37i9dQZF1DXbvABJXBIyiY",
  ],
  movingOn: [
    "https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr",
    "https://open.spotify.com/playlist/37i9dQZF1DX0FOF1IUWK1W",
  ],
  ironic: [
    "https://open.spotify.com/playlist/37i9dQZF1DWTwnEm1IYyoj",
    "https://open.spotify.com/playlist/37i9dQZF1DX4fpCWaHOned",
  ],
} as const;

type PlaylistCategory = keyof typeof PLAYLISTS;

interface PlaylistParams {
  emotionalDamage: number;
  betrayalLevel: number;
  tone: TonePreset;
}

/**
 * Weighted random selection from a probability distribution.
 */
function weightedRandom(weights: Record<PlaylistCategory, number>): PlaylistCategory {
  const entries = Object.entries(weights) as [PlaylistCategory, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let random = Math.random() * total;

  for (const [category, weight] of entries) {
    random -= weight;
    if (random <= 0) return category;
  }

  return entries[0][0];
}

/**
 * Pick a random URL from a category.
 */
function pickFromCategory(category: PlaylistCategory): string {
  const urls = PLAYLISTS[category];
  return urls[Math.floor(Math.random() * urls.length)];
}

/**
 * Dynamically select a Spotify playlist based on receipt parameters.
 *
 * Logic:
 * - High emotionalDamage (7–10) + high betrayalLevel → Sad / Healing
 * - Medium emotionalDamage (4–6) → Reflective
 * - Low emotionalDamage (0–3) → Moving-on / Motivational
 * - tone = "bitter" increases probability of darker (sad/ironic)
 * - tone = "cathartic" increases probability of healing
 * - tone = "wry" increases probability of light / ironic
 */
export function getPlaylistForReceipt({
  emotionalDamage,
  betrayalLevel,
  tone,
}: PlaylistParams): { spotifyUrl: string } {
  // Base weights
  const weights: Record<PlaylistCategory, number> = {
    sad: 0,
    healing: 0,
    reflective: 0,
    movingOn: 0,
    ironic: 0,
  };

  // Determine base weights from emotionalDamage
  if (emotionalDamage >= 7) {
    // High damage
    weights.sad = 30;
    weights.healing = 25;
    weights.reflective = 15;
    weights.movingOn = 5;
    weights.ironic = 10;

    // High betrayal amplifies sad/healing
    if (betrayalLevel >= 4) {
      weights.sad += 20;
      weights.healing += 15;
    } else if (betrayalLevel >= 2) {
      weights.sad += 10;
      weights.healing += 10;
    }
  } else if (emotionalDamage >= 4) {
    // Medium damage
    weights.sad = 10;
    weights.healing = 20;
    weights.reflective = 35;
    weights.movingOn = 20;
    weights.ironic = 15;

    if (betrayalLevel >= 3) {
      weights.sad += 10;
      weights.reflective += 5;
    }
  } else {
    // Low damage (0–3)
    weights.sad = 5;
    weights.healing = 10;
    weights.reflective = 20;
    weights.movingOn = 40;
    weights.ironic = 20;
  }

  // Tone adjustments
  switch (tone) {
    case "bitter":
      weights.sad += 15;
      weights.ironic += 10;
      weights.healing -= 5;
      weights.movingOn -= 5;
      break;
    case "cathartic":
      weights.healing += 20;
      weights.reflective += 10;
      weights.sad -= 5;
      weights.ironic -= 5;
      break;
    case "wry":
      weights.ironic += 15;
      weights.movingOn += 10;
      weights.reflective += 5;
      weights.sad -= 10;
      break;
  }

  // Ensure no negative weights
  for (const key of Object.keys(weights) as PlaylistCategory[]) {
    if (weights[key] < 0) weights[key] = 0;
  }

  const category = weightedRandom(weights);
  return { spotifyUrl: pickFromCategory(category) };
}
