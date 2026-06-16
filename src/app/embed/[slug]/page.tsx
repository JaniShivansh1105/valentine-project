import { notFound } from "next/navigation";
import { getReceipt } from "@/lib/store";
import { getMoodTheme } from "@/lib/mood";
import { RECEIPT_VERDICT } from "@/lib/copy";
import { receiptNumber } from "@/lib/utils";
import { StandaloneBadge } from "@/components/embed-badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EmbedPage({ params }: Props) {
  const { slug } = await params;
  const receipt = await getReceipt(slug);

  if (!receipt) notFound();

  const theme = getMoodTheme(receipt.moodPreset);
  const rcptNo = receiptNumber(slug, receipt.createdAt);

  return (
    <div className="h-screen w-screen bg-white">
      <StandaloneBadge
        verdict={RECEIPT_VERDICT}
        receiptNo={rcptNo}
        accent={theme.accent}
      />
    </div>
  );
}