import { NextRequest, NextResponse } from "next/server";
import { saveReceipt } from "@/lib/store";
import { isRateLimited } from "@/lib/rate-limit";
import { receiptUrl } from "@/lib/utils";
import { moderateContent } from "@/lib/moderation";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import type { ReceiptFormData, TonePreset } from "@/lib/types";

const VALID_TONES: TonePreset[] = ["wry", "bitter", "cathartic"];

export async function POST(request: NextRequest) {
  // Rate-limit by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: ReceiptFormData;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Basic validation
  if (!body.partnerName || typeof body.partnerName !== "string" || !body.partnerName.trim()) {
    return NextResponse.json({ error: "Partner name is required." }, { status: 400 });
  }
  if (!body.timeInvested || typeof body.timeInvested !== "number" || body.timeInvested < 1) {
    return NextResponse.json({ error: "Time invested must be at least 1 month." }, { status: 400 });
  }

  // Content moderation check (if feature enabled)
  if (FEATURE_FLAGS.CONTENT_MODERATION) {
    const noteText = typeof body.note === "string" ? body.note.trim() : "";
    if (noteText) {
      const moderationResult = moderateContent(noteText);
      if (!moderationResult.isClean) {
        return NextResponse.json(
          { error: moderationResult.message || "Please avoid violent or abusive language." },
          { status: 400 }
        );
      }
    }
  }

  // Clamp values
  const data: ReceiptFormData = {
    yourName: typeof body.yourName === "string" ? body.yourName.trim().slice(0, 80) : "",
    partnerName: body.partnerName.trim().slice(0, 80),
    timeInvested: Math.min(Math.max(Math.round(body.timeInvested), 1), 600),
    moneySpent: Math.max(Math.round(body.moneySpent || 0), 0),
    emotionalDamage: Math.min(Math.max(Math.round(body.emotionalDamage || 0), 0), 10),
    betrayalLevel: Math.min(Math.max(Math.round(body.betrayalLevel || 0), 0), 5),
    note: typeof body.note === "string" ? body.note.trim().slice(0, 300) : "",
    anonymous: Boolean(body.anonymous),
    tone: VALID_TONES.includes(body.tone) ? body.tone : "wry",
  };

  const slug = await saveReceipt(data);
  const url = receiptUrl(slug, process.env.NEXT_PUBLIC_BASE_URL);

  return NextResponse.json({ slug, url }, { status: 201 });
}
