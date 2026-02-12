"use client";

/**
 * ValentineBackground — Subtle floating hearts for Valentine's theme
 * Renders behind all content with fixed positioning
 */
export function ValentineBackground() {
  // Create a few hearts with different positions, sizes, and animation delays
  const hearts = [
    { left: "5%", size: 16, delay: 0, duration: 18 },
    { left: "15%", size: 12, delay: 3, duration: 22 },
    { left: "25%", size: 20, delay: 6, duration: 16 },
    { left: "40%", size: 14, delay: 2, duration: 20 },
    { left: "55%", size: 10, delay: 5, duration: 24 },
    { left: "70%", size: 18, delay: 1, duration: 17 },
    { left: "82%", size: 12, delay: 4, duration: 21 },
    { left: "92%", size: 15, delay: 7, duration: 19 },
  ];

  return (
    <div
      className="valentine-bg pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {hearts.map((heart, i) => (
        <div
          key={i}
          className="valentine-heart absolute opacity-20"
          style={{
            left: heart.left,
            width: heart.size,
            height: heart.size,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-rose-300">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
