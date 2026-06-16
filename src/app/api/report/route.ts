import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { isRateLimited } from "@/lib/rate-limit";

interface Report {
  slug: string;
  reason?: string;
  timestamp: Date;
  ip: string;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Please wait before submitting another report." },
      { status: 429 }
    );
  }

  let body: { slug?: string; reason?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body.slug || typeof body.slug !== "string") {
    return NextResponse.json(
      { error: "Missing receipt slug." },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("closureDB");

    const report: Report = {
      slug: body.slug,
      reason: body.reason,
      timestamp: new Date(),
      ip,
    };

    await db.collection("reports").insertOne(report);

    return NextResponse.json(
      { success: true, message: "Report submitted." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Report API Error]", error);
    return NextResponse.json(
      { error: "Failed to submit report. Please try again." },
      { status: 500 }
    );
  }
}