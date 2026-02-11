"use client";

import type { MoodPreset } from "@/lib/types";
import { getMoodTheme } from "@/lib/mood";

interface MascotProps {
  mood: MoodPreset;
  className?: string;
  /** Optional: trigger blink/glance animation */
  isInteracting?: boolean;
}

/**
 * Single round-face mascot with 3 expression states:
 *   calm       → neutral smile, relaxed eyebrows
 *   side-eye   → one raised eyebrow, smirk
 *   dead-inside → flat line eyes, tiny crack mark
 *
 * Colour is driven by the mood's accent hex.
 *
 * Supports:
 * - prefers-reduced-motion via CSS
 * - Interaction state for CTA hover effects
 * - CSS custom property --mascot-accent for theming
 */
export function MascotSVG({ mood, className = "", isInteracting = false }: MascotProps) {
  const theme = getMoodTheme(mood);
  const expression = theme.mascot; // "calm" | "side-eye" | "dead-inside"
  const c = theme.accent;
  const isNuclear = mood === "nuclear";

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
      role="img"
      style={{ "--mascot-accent": c } as React.CSSProperties}
    >
      {/* Face circle */}
      <circle cx="60" cy="60" r="44" fill={c} opacity="0.12" />
      <circle cx="60" cy="60" r="44" stroke={c} strokeWidth="2.5" />

      {/* Blush spots */}
      <circle cx="34" cy="72" r="7" fill={c} opacity="0.10" />
      <circle cx="86" cy="72" r="7" fill={c} opacity="0.10" />

      {expression === "calm" && (
        <>
          {/* Relaxed eyebrows */}
          <line x1="38" y1="44" x2="50" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="44" x2="82" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          {/* Round eyes — blink on interaction */}
          {isInteracting ? (
            <>
              {/* Closed eyes (blink) */}
              <line x1="40" y1="56" x2="48" y2="56" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="72" y1="56" x2="80" y2="56" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="44" cy="56" r="4" fill={c} />
              <circle cx="76" cy="56" r="4" fill={c} />
            </>
          )}
          {/* Gentle smile */}
          <path d="M46 74 Q60 86 74 74" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {expression === "side-eye" && (
        <>
          {/* Left eyebrow normal, right eyebrow raised */}
          <line x1="38" y1="44" x2="50" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="40" x2="82" y2="44" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          {/* Left eye normal, right eye looking sideways */}
          <circle cx="44" cy="56" r="4" fill={c} />
          <circle cx="78" cy="56" r="4" fill={c} />
          <circle cx="80" cy="55" r="1.5" fill="white" />
          {/* Smirk — asymmetric smile */}
          <path d="M46 74 Q54 80 62 76 Q70 72 76 72" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {expression === "dead-inside" && (
        <>
          {/* Flat tired eyebrows */}
          <line x1="36" y1="46" x2="50" y2="48" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="84" y1="46" x2="70" y2="48" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          {/* Flat line eyes (dead stare) */}
          <line x1="38" y1="58" x2="50" y2="58" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="58" x2="82" y2="58" stroke={c} strokeWidth="3" strokeLinecap="round" />
          {/* Flat mouth */}
          <line x1="46" y1="76" x2="74" y2="76" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          {/* Tiny crack mark on forehead */}
          <path d="M58 28 L56 34 L62 32 L60 38" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </>
      )}

      {/* Impact lines for nuclear */}
      {isNuclear && (
        <>
          <line x1="16" y1="26" x2="8" y2="18" stroke={c} strokeWidth="1.5" opacity="0.45" strokeLinecap="round" />
          <line x1="104" y1="26" x2="112" y2="18" stroke={c} strokeWidth="1.5" opacity="0.45" strokeLinecap="round" />
          <line x1="60" y1="8" x2="60" y2="0" stroke={c} strokeWidth="1.5" opacity="0.45" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
