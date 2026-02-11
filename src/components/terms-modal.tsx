"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * "Terms of Closure" — a humorous modal with lighthearted legal-sounding copy.
 * ── To change the copy, edit the paragraphs below. ──
 */
export function TermsModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
          aria-label="View Terms of Closure"
        >
          <Info className="h-3.5 w-3.5" />
          Terms of Closure
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none">
          <Dialog.Title className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Terms of Closure
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Humorous terms and conditions for the closure receipt.
          </Dialog.Description>

          <div className="mt-4 space-y-3 text-sm text-neutral-600 leading-relaxed">
            <p>
              <strong>1. No Refunds.</strong> All emotional investments are final.
              We cannot refund time, energy, or questionable Spotify playlists
              created during the relationship.
            </p>
            <p>
              <strong>2. Receipt Validity.</strong> This receipt is valid for one
              (1) lifetime. It may be shared publicly but must not be used to
              harass, stalk, or shame anyone. Keep it classy.
            </p>
            <p>
              <strong>3. Damage Assessment.</strong> Emotional damage scores are
              self-reported and may not be independently verified. We trust you,
              but also — therapy is excellent.
            </p>
            <p>
              <strong>4. Liability.</strong> The Closure Receipt Company™ is not
              liable for any feelings re-experienced while generating this
              document. Proceed at your own emotional risk.
            </p>
            <p>
              <strong>5. Moving On.</strong> By generating this receipt, you agree
              to take at least one positive step forward today. Even a small one
              counts.
            </p>
          </div>

          <div className="mt-5 flex justify-end">
            <Dialog.Close asChild>
              <Button variant="secondary" size="sm">
                I accept (obviously)
              </Button>
            </Dialog.Close>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
