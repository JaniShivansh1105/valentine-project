/**
 * Stub test for the POST /api/create route.
 *
 * Because Next.js App Router route handlers run in the Node runtime,
 * we test the underlying store/validation logic here.
 * For full integration tests, use Playwright or similar E2E framework.
 */

import { saveReceipt, getReceipt } from "@/lib/store";
import type { ReceiptFormData } from "@/lib/types";

const sampleData: ReceiptFormData = {
  yourName: "Test User",
  partnerName: "Ex",
  timeInvested: 12,
  moneySpent: 5000,
  emotionalDamage: 7,
  betrayalLevel: 3,
  note: "Just testing.",
  anonymous: false,
  tone: "wry",
};

describe("store", () => {
  it("saves a receipt and retrieves it by slug", async () => {
    const slug = await saveReceipt(sampleData);
    expect(typeof slug).toBe("string");
    expect(slug.length).toBe(8);

    const receipt = await getReceipt(slug);
    expect(receipt).not.toBeNull();
    expect(receipt!.partnerName).toBe("Ex");
    expect(receipt!.moodPreset).toBe("spicy");
    expect(receipt!.createdAt).toBeDefined();
  });

  it("returns null for a non-existent slug", async () => {
    const receipt = await getReceipt("nonexist");
    expect(receipt).toBeNull();
  });
});
