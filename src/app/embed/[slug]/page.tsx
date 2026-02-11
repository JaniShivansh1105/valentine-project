import { notFound } from "next/navigation";
import { getReceipt } from "@/lib/store";
import { getMoodTheme } from "@/lib/mood";
import { RECEIPT_VERDICT } from "@/lib/copy";
import { StandaloneBadge } from "@/components/embed-badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EmbedPage({ params }: Props) {
  const { slug } = await params;
  const receipt = await getReceipt(slug);

  if (!receipt) notFound();

  const theme = getMoodTheme(receipt.moodPreset);
  const receiptNo = `CR-${new Date(receipt.createdAt).getFullYear()}-${slug.slice(0, 4).toUpperCase()}`;

  return (
    <div className="h-screen w-screen bg-white">
      <StandaloneBadge
        verdict={RECEIPT_VERDICT}
        receiptNo={receiptNo}
        accent={theme.accent}
      />
    </div>
  );
}