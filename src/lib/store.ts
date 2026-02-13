import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { ReceiptFormData } from "./types";

export async function saveReceipt(data: ReceiptFormData): Promise<string> {
  const client = await clientPromise;
  const db = client.db("closureDB");

  const result = await db.collection("receipts").insertOne({
    ...data,
    createdAt: new Date(),
  });

  return result.insertedId.toString();
}

export async function getReceipt(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("closureDB");

    const receipt = await db
      .collection("receipts")
      .findOne({ _id: new ObjectId(id) });

    if (!receipt) return null;

    return {
      ...receipt,
      _id: receipt._id.toString(),
    };
  } catch {
    return null;
  }
}