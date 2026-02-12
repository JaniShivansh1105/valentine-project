"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  Copy,
  Download,
  Music,
  Flag,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MascotSVG } from "@/components/mascot";
import type { ReceiptRecord } from "@/lib/types";
import { getMoodTheme, buildSubtitle, deriveLessons, closurePlaylist, toneLine } from "@/lib/mood";
import { receiptUrl, withUtm } from "@/lib/utils";
import { RECEIPT_VERDICT, RECEIPT_TITLE } from "@/lib/copy";
import { track, trackPageView } from "@/lib/analytics";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { withPdfFonts } from "@/lib/pdf-fonts";
import { ShareButtons } from "./share-buttons";

interface Props {
  receipt: ReceiptRecord;
}

/** Generate a receipt number from the slug + timestamp. */
function receiptNumber(slug: string, createdAt: string): string {
  const year = new Date(createdAt).getFullYear();
  const hash = slug.slice(0, 4).toUpperCase();
  return `CR-${year}-${hash}`;
}

/** Format timestamp for display. */
function formatTimestamp(createdAt: string): { iso: string; formatted: string; timezone: string } {
  const date = new Date(createdAt);
  return {
    iso: createdAt,
    formatted: date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function ReceiptCard({ receipt }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = getMoodTheme(receipt.moodPreset);
  const subtitle = buildSubtitle(receipt.timeInvested, receipt.moneySpent);
  const lessons = deriveLessons(receipt.emotionalDamage, receipt.betrayalLevel);
  const playlist = closurePlaylist(receipt.emotionalDamage);
  const url = receiptUrl(receipt.slug, typeof window !== "undefined" ? window.location.origin : undefined);
  const displayName = receipt.anonymous ? "Anonymous" : receipt.yourName || "Anonymous";
  const closing = toneLine(receipt.tone ?? "wry", receipt.emotionalDamage);
  const rcptNo = receiptNumber(receipt.slug, receipt.createdAt);
  const timestamp = formatTimestamp(receipt.createdAt);

  // Track page view on mount
  useEffect(() => {
    if (FEATURE_FLAGS.ANALYTICS) {
      trackPageView("receipt", { slug: receipt.slug });
    }
  }, [receipt.slug]);

  // Confetti for low emotional damage
  useEffect(() => {
    if (receipt.emotionalDamage <= 2) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a7f3d0", "#fef08a", "#fecaca"],
      });
    }
  }, [receipt.emotionalDamage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(withUtm(url, "copy"));
      toast.success("Link copied to clipboard.");
      if (FEATURE_FLAGS.ANALYTICS) {
        track({ name: "share_clicked", payload: { channel: "copy", slug: receipt.slug } });
      }
    } catch {
      toast.error("Could not copy link.");
    }
  };

  /**
   * Handle PDF download with font embedding.
   * Uses withPdfFonts wrapper if FEATURE_PDF_FONTS is enabled.
   */
  const handleDownloadPdf = useCallback(async () => {
    if (FEATURE_FLAGS.PDF_FONTS) {
      await withPdfFonts(() => {
        window.print();
      });
    } else {
      window.print();
    }

    if (FEATURE_FLAGS.ANALYTICS) {
      track({ name: "pdf_downloaded", payload: { slug: receipt.slug } });
    }
  }, [receipt.slug]);

  /**
   * Handle report submission via API.
   */
  const handleReport = useCallback(async () => {
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: receipt.slug }),
      });

      if (res.ok) {
        toast.info("Report submitted. We'll review this receipt.");
        if (FEATURE_FLAGS.ANALYTICS) {
          track({ name: "report_submitted", payload: { slug: receipt.slug } });
        }
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to submit report.");
      }
    } catch {
      toast.error("Failed to submit report. Please try again.");
    }
  }, [receipt.slug]);

  return (
    <motion.div
      className="flex w-full max-w-xl flex-col items-center gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top banner — using standardised copy */}
      <motion.p
        className="text-center text-lg font-extrabold tracking-wider uppercase sm:text-xl md:text-2xl receipt-heading"
        style={{ fontFamily: "var(--font-heading)", color: theme.accent }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        data-pdf-heading
      >
        {RECEIPT_VERDICT}
      </motion.p>

      {/* The printable card */}
      <Card ref={cardRef} className="w-full transition-colors receipt-card">
        <CardHeader
          className="rounded-t-2xl"
          style={{ backgroundColor: theme.accentLight }}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold receipt-heading" style={{ fontFamily: "var(--font-heading)" }} data-pdf-heading>
                {RECEIPT_TITLE}
              </CardTitle>
              <CardDescription className="text-base font-medium" style={{ color: theme.accent }}>
                {subtitle}
              </CardDescription>
            </div>
            <MascotSVG mood={receipt.moodPreset} className="h-16 w-16 animate-float" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 pt-6">
          {/* Receipt number with timestamp */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-mono text-neutral-400 tracking-wider">{rcptNo}</p>
            <p className="flex items-center gap-1.5 text-xs text-neutral-300">
              <Clock className="h-3 w-3" />
              <time dateTime={timestamp.iso} title={`${timestamp.timezone}`}>
                {timestamp.formatted}
              </time>
            </p>
          </div>

          {/* Invoice-like breakdown */}
          <ul className="divide-y divide-neutral-100 text-base" role="list">
            <LineItem label="Time invested" value={`${receipt.timeInvested} month${receipt.timeInvested !== 1 ? "s" : ""}`} />
            {receipt.moneySpent > 0 && (
              <LineItem label="Money spent" value={`₹${receipt.moneySpent.toLocaleString("en-IN")}`} />
            )}
            <LineItem label="Emotional damage" value={`${receipt.emotionalDamage}/10`} />
            <LineItem label="Betrayal level" value={`${receipt.betrayalLevel}/5`} />
          </ul>

          {/* Lessons learned */}
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">
              Lessons Learned
            </h3>
            <ul className="flex flex-wrap gap-2">
              {lessons.map((l) => (
                <li
                  key={l}
                  className="rounded-full px-4 py-1.5 text-sm font-medium"
                  style={{ backgroundColor: theme.accentLight, color: theme.accent }}
                >
                  {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Personal note */}
          {receipt.note && (
            <blockquote className="border-l-2 border-neutral-200 pl-4 text-base italic text-neutral-500">
              &ldquo;{receipt.note}&rdquo;
            </blockquote>
          )}

          {/* Author */}
          <p className="text-sm text-neutral-400">
            By: <span className="font-medium text-neutral-600">{displayName}</span>
          </p>

          {/* Closing line (tone-aware) */}
          <p className="text-base font-medium" style={{ color: theme.accent }}>
            {closing}
          </p>

          {/* Playlist suggestion */}
          <a
            href={playlist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <Music className="h-3.5 w-3.5" />
            Playlist: {playlist.label}
          </a>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={handleCopy} aria-label="Copy link to clipboard">
          <Copy className="mr-1.5 h-4 w-4" /> Copy link
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPdf} aria-label="Download as PDF">
          <Download className="mr-1.5 h-4 w-4" /> Download PDF
        </Button>
        <ShareButtons url={url} slug={receipt.slug} />
        <Button
          variant="ghost"
          size="sm"
          className="text-neutral-400 hover:text-red-500"
          onClick={handleReport}
          aria-label="Report this receipt"
        >
          <Flag className="mr-1 h-4 w-4" /> Report
        </Button>
      </div>
    </motion.div>
  );
}

/* Small helper component for table-like rows */
function LineItem({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between py-2.5">
      <span className="text-neutral-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </li>
  );
}
