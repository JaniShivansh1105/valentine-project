/**
 * Embeddable Badge Widget Component
 *
 * Displays a minimal receipt verification badge that can be
 * embedded on external sites via an iframe or copy-paste snippet.
 *
 * @module components/embed-badge
 */

"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { EMBED } from "@/lib/copy";

interface EmbedBadgeProps {
  slug: string;
  verdict: string;
  receiptNo: string;
  accent: string;
  baseUrl?: string;
}

/**
 * Generate the embed snippet HTML for copy-paste.
 */
function generateEmbedSnippet(slug: string, baseUrl: string): string {
  return `<iframe 
  src="${baseUrl}/embed/${slug}" 
  width="320" 
  height="100" 
  frameborder="0" 
  style="border: none; border-radius: 12px; overflow: hidden;"
  title="Closure Receipt Badge"
></iframe>`;
}

/**
 * EmbedBadge component — shows badge and copy snippet.
 */
export function EmbedBadge({
  slug,
  verdict,
  receiptNo,
  accent,
  baseUrl = typeof window !== "undefined" ? window.location.origin : "",
}: EmbedBadgeProps) {
  const [copied, setCopied] = useState(false);

  // Feature flag check
  if (!FEATURE_FLAGS.EMBED_BADGE) {
    return null;
  }

  const snippet = generateEmbedSnippet(slug, baseUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success("Embed code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy embed code.");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4">
      {/* Badge preview */}
      <div
        className="flex items-center gap-3 rounded-lg p-3"
        style={{ backgroundColor: `${accent}10`, border: `1px solid ${accent}30` }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          ✓
        </div>
        <div className="flex-1">
          <p
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: accent }}
          >
            {verdict}
          </p>
          <p className="font-mono text-xs text-neutral-400">{receiptNo}</p>
        </div>
      </div>

      {/* Embed snippet */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-neutral-500">
          {EMBED.embedSnippetLabel}
        </label>
        <div className="relative">
          <pre className="overflow-x-auto rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600">
            {snippet}
          </pre>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={handleCopy}
            aria-label="Copy embed code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Standalone badge for the embed iframe endpoint.
 * Renders just the badge without the snippet UI.
 */
export function StandaloneBadge({
  verdict,
  receiptNo,
  accent,
}: {
  verdict: string;
  receiptNo: string;
  accent: string;
}) {
  return (
    <div
      className="flex h-full w-full items-center gap-3 rounded-xl p-4"
      style={{ backgroundColor: `${accent}10`, border: `1px solid ${accent}30` }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white"
        style={{ backgroundColor: accent }}
      >
        ✓
      </div>
      <div className="flex-1">
        <p
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: accent }}
        >
          {verdict}
        </p>
        <p className="font-mono text-xs text-neutral-400">{receiptNo}</p>
        <p className="mt-1 text-xs text-neutral-300">closurereceipt.in</p>
      </div>
    </div>
  );
}
