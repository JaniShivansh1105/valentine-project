import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("closureDB");

    const receipt = await db
      .collection("receipts")
      .findOne({ _id: new ObjectId(slug) });

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(receipt);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid receipt ID." },
      { status: 400 }
    );
  }
}