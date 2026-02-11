/**
 * Dynamic Open Graph Image Generator
 *
 * GET /api/og?slug={slug}
 *
 * Returns an SVG image (1200×630) suitable for social sharing.
 * Includes the verdict, subtitle, receipt number, and mascot.
 *
 * @module api/og/route
 */

import { NextRequest, NextResponse } from "next/server";
import { getReceipt } from "@/lib/store";
import { getMoodTheme, buildSubtitle } from "@/lib/mood";
import { RECEIPT_VERDICT, SHARE_CAPTION } from "@/lib/copy";
import { FEATURE_FLAGS } from "@/lib/feature-flags";

/**
 * Generate a receipt number from slug and date.
 */
function receiptNumber(slug: string, createdAt: string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hash = slug.slice(0, 4).toUpperCase();
  return `CR-${year}-${month}-${day}-${hash}`;
}

/**
 * Generate the inline SVG mascot for the OG image.
 * Simplified version of the MascotSVG component.
 */
function generateMascotSvg(accent: string, expression: "calm" | "side-eye" | "dead-inside"): string {
  const faceContent = expression === "calm" ? `
    <!-- Relaxed eyebrows -->
    <line x1="38" y1="44" x2="50" y2="44" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="70" y1="44" x2="82" y2="44" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Round eyes -->
    <circle cx="44" cy="56" r="4" fill="${accent}"/>
    <circle cx="76" cy="56" r="4" fill="${accent}"/>
    <!-- Gentle smile -->
    <path d="M46 74 Q60 86 74 74" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  ` : expression === "side-eye" ? `
    <!-- Left eyebrow normal, right raised -->
    <line x1="38" y1="44" x2="50" y2="44" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="70" y1="40" x2="82" y2="44" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Eyes with side glance -->
    <circle cx="44" cy="56" r="4" fill="${accent}"/>
    <circle cx="78" cy="56" r="4" fill="${accent}"/>
    <circle cx="80" cy="55" r="1.5" fill="white"/>
    <!-- Smirk -->
    <path d="M46 74 Q54 80 62 76 Q70 72 76 72" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  ` : `
    <!-- Flat tired eyebrows -->
    <line x1="36" y1="46" x2="50" y2="48" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="84" y1="46" x2="70" y2="48" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Flat line eyes -->
    <line x1="38" y1="58" x2="50" y2="58" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    <line x1="70" y1="58" x2="82" y2="58" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    <!-- Flat mouth -->
    <line x1="46" y1="76" x2="74" y2="76" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
  `;

  return `
    <svg x="1050" y="440" width="120" height="120" viewBox="0 0 120 120" fill="none">
      <!-- Face circle -->
      <circle cx="60" cy="60" r="44" fill="${accent}" opacity="0.12"/>
      <circle cx="60" cy="60" r="44" stroke="${accent}" stroke-width="2.5"/>
      <!-- Blush spots -->
      <circle cx="34" cy="72" r="7" fill="${accent}" opacity="0.10"/>
      <circle cx="86" cy="72" r="7" fill="${accent}" opacity="0.10"/>
      ${faceContent}
    </svg>
  `;
}

/**
 * Generate the complete OG image SVG.
 */
function generateOgSvg(params: {
  verdict: string;
  subtitle: string;
  receiptNo: string;
  accent: string;
  accentLight: string;
  mascotExpression: "calm" | "side-eye" | "dead-inside";
}): string {
  const { verdict, subtitle, receiptNo, accent, accentLight, mascotExpression } = params;

  // Escape text for SVG
  const escapeXml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;800&amp;family=Inter:wght@400;500&amp;display=swap');
      
      .heading {
        font-family: 'Poppins', system-ui, sans-serif;
        font-weight: 800;
      }
      .body {
        font-family: 'Inter', system-ui, sans-serif;
        font-weight: 400;
      }
      .mono {
        font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        font-weight: 400;
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#fbf0f3"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="8" fill="${accent}"/>

  <!-- Receipt container with subtle shadow -->
  <rect x="60" y="50" width="1080" height="530" rx="24" fill="white" filter="url(#shadow)"/>
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Header background -->
  <rect x="60" y="50" width="1080" height="140" rx="24" fill="${accentLight}"/>
  <rect x="60" y="166" width="1080" height="24" fill="${accentLight}"/>

  <!-- Closure Receipt title -->
  <text x="100" y="130" class="heading" font-size="42" fill="#1c1917">
    Closure Receipt
  </text>

  <!-- Receipt number -->
  <text x="100" y="170" class="mono" font-size="16" fill="#a3a3a3" letter-spacing="0.05em">
    ${escapeXml(receiptNo)}
  </text>

  <!-- Main verdict -->
  <text x="100" y="290" class="heading" font-size="48" fill="${accent}" text-transform="uppercase" letter-spacing="0.04em">
    ${escapeXml(verdict)}
  </text>

  <!-- Subtitle line -->
  <text x="100" y="350" class="body" font-size="28" fill="#525252">
    ${escapeXml(subtitle)}
  </text>

  <!-- Divider -->
  <line x1="100" y1="400" x2="900" y2="400" stroke="#e5e5e5" stroke-width="1"/>

  <!-- Caption -->
  <text x="100" y="460" class="body" font-size="22" fill="#737373" font-style="italic">
    "${escapeXml(SHARE_CAPTION)}"
  </text>

  <!-- Footer -->
  <text x="100" y="540" class="body" font-size="16" fill="#a3a3a3">
    closurereceipt.in • Built for reflection, not revenge
  </text>

  <!-- Mascot -->
  ${generateMascotSvg(accent, mascotExpression)}

  <!-- Accent corner decoration -->
  <circle cx="1120" cy="100" r="30" fill="${accent}" opacity="0.15"/>
  <circle cx="1140" cy="80" r="15" fill="${accent}" opacity="0.1"/>
</svg>`;
}

/**
 * GET /api/og?slug={slug}
 *
 * Returns an SVG image for Open Graph social sharing.
 */
export async function GET(request: NextRequest) {
  // Check feature flag
  if (!FEATURE_FLAGS.OG_API) {
    return NextResponse.json(
      { error: "OG API is not enabled. Set NEXT_PUBLIC_FEATURE_OG_API=true" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug parameter" },
      { status: 400 }
    );
  }

  // Fetch receipt data
  const receipt = await getReceipt(slug);

  // Use placeholder values if receipt not found
  const theme = receipt
    ? getMoodTheme(receipt.moodPreset)
    : getMoodTheme("reflective");

  const subtitle = receipt
    ? buildSubtitle(receipt.timeInvested, receipt.moneySpent)
    : "Time invested · Money spent · No refund issued";

  const receiptNo = receipt
    ? receiptNumber(slug, receipt.createdAt)
    : (() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hash = slug.slice(0, 4).toUpperCase();
        return `CR-${year}-${month}-${day}-${hash}`;
      })();

  const svg = generateOgSvg({
    verdict: RECEIPT_VERDICT,
    subtitle,
    receiptNo,
    accent: theme.accent,
    accentLight: theme.accentLight,
    mascotExpression: theme.mascot,
  });

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
