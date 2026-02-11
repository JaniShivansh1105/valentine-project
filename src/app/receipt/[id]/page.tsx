import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReceipt } from "@/lib/store";
import { getMoodTheme } from "@/lib/mood";
import { buildSubtitle } from "@/lib/mood";
import { receiptUrl } from "@/lib/utils";
import { RECEIPT_VERDICT, SHARE_CAPTION, META } from "@/lib/copy";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { ReceiptCard } from "./receipt-card";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const receipt = await getReceipt(id);
  if (!receipt) return { title: "Not Found" };

  const theme = getMoodTheme(receipt.moodPreset);
  const title = `Closure Receipt — ${buildSubtitle(receipt.timeInvested, receipt.moneySpent)}`;
  const url = receiptUrl(receipt.slug, process.env.NEXT_PUBLIC_BASE_URL);

  // OG image URL — uses /api/og endpoint if feature enabled
  const ogImageUrl = FEATURE_FLAGS.OG_API
    ? `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/og?slug=${receipt.slug}`
    : undefined;

  return {
    title,
    description: theme.closingLine,
    openGraph: {
      title: META.ogTitle,
      description: `${buildSubtitle(receipt.timeInvested, receipt.moneySpent)} | ${SHARE_CAPTION}`,
      type: "article",
      url,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: RECEIPT_VERDICT,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: META.ogTitle,
      description: buildSubtitle(receipt.timeInvested, receipt.moneySpent),
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default async function ReceiptPage({ params }: Props) {
  const { id } = await params;
  const receipt = await getReceipt(id);

  if (!receipt) notFound();

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12" data-mood={receipt.moodPreset}>
      <div className="mb-8 w-full max-w-xl no-print">
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Create another
        </Link>
      </div>
      <ReceiptCard receipt={receipt} />
    </main>
  );
}
