"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MascotSVG } from "@/components/mascot";
import { HERO_LINES, CTA_TEXT } from "@/lib/copy";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { trackPageView, track } from "@/lib/analytics";

/**
 * HomePage — The landing page with polished hero section.
 *
 * Features (behind FEATURE_POLISHED_HERO flag):
 * - Three-line headline structure for screenshot-perfect styling
 * - "breakup" word with subtle rotation animation
 * - CTA with scale animation on hover
 * - Mascot interaction on CTA hover
 * - Respects prefers-reduced-motion
 */
export default function HomePage() {
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Track page view on mount
  useEffect(() => {
    setMounted(true);
    if (FEATURE_FLAGS.ANALYTICS) {
      trackPageView("home");
    }
  }, []);

  // Use polished hero if feature flag enabled, otherwise fallback
  const usePolishedHero = FEATURE_FLAGS.POLISHED_HERO;

  // Animation variants
  const headlineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const mascotVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  };

  // Handle CTA click tracking
  const handleCtaClick = () => {
    if (FEATURE_FLAGS.ANALYTICS) {
      track({ name: "generate_receipt_clicked" });
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-[820px] flex-col items-start lg:flex-row lg:items-center lg:gap-12">
        {/* Left: text — left-aligned */}
        <div className="flex-1">
          {usePolishedHero ? (
            /* ────────────────────────────────────────────────────────
               POLISHED HERO: Three-line structure with animations
               ──────────────────────────────────────────────────────── */
            <motion.h1
              className="text-hero"
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: "easeOut",
              }}
            >
              {/* Line A: "Turn your" — black */}
              <span className="block text-foreground">{HERO_LINES.lineA}</span>

              {/* Line B: "breakup into a" — with breakup having subtle rotation */}
              <span className="block text-accent">
                <span
                  className="inline-block transition-transform duration-300"
                  style={{
                    transform: mounted && !prefersReducedMotion ? "rotate(-2deg)" : undefined,
                    textDecoration: "underline",
                    textDecorationColor: "currentColor",
                    textDecorationThickness: "2px",
                    textUnderlineOffset: "4px",
                  }}
                >
                  breakup
                </span>{" "}
                into a
              </span>

              {/* Line C: "RECEIPT." — heavier accent, caps */}
              <span
                className="block text-accent"
                style={{ fontWeight: 800, letterSpacing: "0.02em" }}
              >
                {HERO_LINES.lineC}
              </span>
            </motion.h1>
          ) : (
            /* ────────────────────────────────────────────────────────
               ORIGINAL HERO: Fallback for feature flag off
               ──────────────────────────────────────────────────────── */
            <motion.h1
              className="text-hero"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Turn your <span className="text-red-500">breakup</span>
              <br />
              <span className="text-accent">into a receipt.</span>
            </motion.h1>
          )}

          {/* CTA Button with scale animation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={ctaVariants}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.15,
            }}
          >
            <Button
              asChild
              size="lg"
              className="mt-8 gap-2 rounded-full px-8 text-base transition-transform duration-120 hover:scale-[1.06]"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onClick={handleCtaClick}
            >
              <Link href="/generate">
                {CTA_TEXT.replace(" →", "")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Right: mascot (desktop beside, mobile above) */}
        <motion.div
          className="order-first mb-8 self-center lg:order-last lg:mb-0"
          initial="hidden"
          animate="visible"
          variants={mascotVariants}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            delay: prefersReducedMotion ? 0 : 0.15,
            type: "spring",
            stiffness: 120,
          }}
        >
          <div
            className={`transition-transform duration-300 ${
              prefersReducedMotion ? "" : "animate-float"
            }`}
            style={{
              transform:
                hovering && FEATURE_FLAGS.MASCOT_INTERACTION && !prefersReducedMotion
                  ? "rotate(-8deg) scale(1.05)"
                  : undefined,
            }}
            aria-hidden="true"
          >
            <MascotSVG
              mood={hovering && FEATURE_FLAGS.MASCOT_INTERACTION ? "reflective" : "calm"}
              className="h-44 w-44 lg:h-56 lg:w-56"
            />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
