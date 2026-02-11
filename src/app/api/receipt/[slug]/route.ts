import { NextRequest, NextResponse } from "next/server";
import { getReceipt } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  const receipt = await getReceipt(slug);

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found." }, { status: 404 });
  }

  return NextResponse.json(receipt);
}
