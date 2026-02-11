"use client";

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
 * Social share buttons — WhatsApp, Twitter/X, LinkedIn, Facebook, Reddit.
 * Each link appends UTM params for tracking.
 * Uses the single approved share caption by default.
 */
export function ShareButtons({ url, text, slug }: Props) {
  // Use the single perfect caption as default
  const shareText = text || SHARE_CAPTION;
  const encoded = (source: string) => encodeURIComponent(withUtm(url, source));
  const encodedText = encodeURIComponent(shareText);

  const handleClick = (channel: string) => {
    if (FEATURE_FLAGS.ANALYTICS) {
      trackShare(channel, slug);
    }
  };

  const channels = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encoded("whatsapp")}`,
      colour: "hover:bg-green-50 hover:text-green-700",
      channel: "whatsapp",
    },
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encoded("twitter")}`,
      colour: "hover:bg-sky-50 hover:text-sky-700",
      channel: "twitter",
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
      {channels.map((ch) => (
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
    </>
  );
}
