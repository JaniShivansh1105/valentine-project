import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { moodFromDamage } from "./mood";
import type { ReceiptFormData, ReceiptRecord } from "./types";

export async function saveReceipt(data: ReceiptFormData): Promise<string> {
  const client = await clientPromise;
  const db = client.db("closureDB");

  const result = await db.collection("receipts").insertOne({
    ...data,
    createdAt: new Date(),
  });

  return result.insertedId.toString();
}

export async function getReceipt(id: string): Promise<ReceiptRecord | null> {
  try {
    // 🔥 IMPORTANT FIX
    const cleanId = id.trim();

    if (!ObjectId.isValid(cleanId)) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db("closureDB");

    const receipt = await db
      .collection("receipts")
      .findOne({ _id: new ObjectId(cleanId) });

    if (!receipt) return null;

    const emotionalDamage =
      typeof receipt.emotionalDamage === "number"
        ? receipt.emotionalDamage
        : 0;

    return {
      ...receipt,
      _id: receipt._id.toString(),
      slug: receipt._id.toString(),
      createdAt:
        receipt.createdAt instanceof Date
          ? receipt.createdAt.toISOString()
          : String(receipt.createdAt),
      moodPreset: moodFromDamage(emotionalDamage),
    } as unknown as ReceiptRecord;
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return null;
  }
}