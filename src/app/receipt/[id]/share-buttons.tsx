"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { withUtm } from "@/lib/utils";
import { SHARE_CAPTION } from "@/lib/copy";
import { trackShare } from "@/lib/analytics";
import { FEATURE_FLAGS } from "@/lib/feature-flags";

interface Props {
  url: string;
  /** Optional custom text — defaults to SHARE_CAPTION */
  text?: string;
  slug: string;
}

/**
 * Social share buttons — WhatsApp, X, Instagram (copy), LinkedIn, Facebook, Reddit.
 * Each link appends UTM params for tracking.
 * Uses the single approved share caption by default.
 *
 * Note: Instagram does not support URL-based web sharing.
 * The Instagram button copies the link to clipboard with a guide toast.
 */
export function ShareButtons({ url, text, slug }: Props) {
  const shareText = text || SHARE_CAPTION;
  const encoded = (source: string) => encodeURIComponent(withUtm(url, source));
  const encodedText = encodeURIComponent(shareText);

  const handleClick = (channel: string) => {
    if (FEATURE_FLAGS.ANALYTICS) {
      trackShare(channel, slug);
    }
  };

  /** Instagram: copy link to clipboard — Instagram has no web share API */
  const handleInstagramCopy = async () => {
    try {
      await navigator.clipboard.writeText(withUtm(url, "instagram"));
      toast.success("Link copied — paste it in your Instagram bio or story!");
      handleClick("instagram");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  /** All standard link-based channels */
  const linkChannels = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encoded("whatsapp")}`,
      colour: "hover:bg-green-50 hover:text-green-700",
      channel: "whatsapp",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encoded("twitter")}`,
      colour: "hover:bg-neutral-100 hover:text-neutral-900",
      channel: "x",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded("linkedin")}`,
      colour: "hover:bg-blue-50 hover:text-blue-700",
      channel: "linkedin",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded("facebook")}`,
      colour: "hover:bg-indigo-50 hover:text-indigo-700",
      channel: "facebook",
    },
    {
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encoded("reddit")}&title=${encodedText}`,
      colour: "hover:bg-orange-50 hover:text-orange-700",
      channel: "reddit",
    },
  ];

  return (
    <>
      {linkChannels.map((ch) => (
        <Button
          key={ch.label}
          variant="outline"
          size="sm"
          asChild
          className={`transition-colors ${ch.colour}`}
          onClick={() => handleClick(ch.channel)}
        >
          <a href={ch.href} target="_blank" rel="noopener noreferrer">
            {ch.label}
          </a>
        </Button>
      ))}

      {/* Instagram — copy to clipboard (no web share API support) */}
      <Button
        variant="outline"
        size="sm"
        className="transition-colors hover:bg-pink-50 hover:text-pink-600"
        onClick={handleInstagramCopy}
        aria-label="Copy link for Instagram"
      >
        Instagram
      </Button>
    </>
  );
}
