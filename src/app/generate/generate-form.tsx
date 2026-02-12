"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { moodFromDamage, getMoodTheme } from "@/lib/mood";
import { MascotSVG } from "@/components/mascot";
import { TermsModal } from "@/components/terms-modal";
import type { MoodPreset, TonePreset } from "@/lib/types";
import { Loader2 } from "lucide-react";

const toneOptions: { value: TonePreset; label: string; emoji: string }[] = [
  { value: "wry", label: "Wry", emoji: "😏" },
  { value: "bitter", label: "Bitter", emoji: "🔥" },
  { value: "cathartic", label: "Cathartic", emoji: "🌊" },
];

const emotionalLabels: Record<MoodPreset, string> = {
  calm: "Calm",
  reflective: "Reflective",
  spicy: "Spicy",
  nuclear: "Nuclear",
};

export function GenerateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Form state
  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [timeInvested, setTimeInvested] = useState("");
  const [moneySpent, setMoneySpent] = useState("");
  const [emotionalDamage, setEmotionalDamage] = useState(5);
  const [betrayalLevel, setBetrayalLevel] = useState(2);
  const [note, setNote] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [tone, setTone] = useState<TonePreset>("wry");

  const mood: MoodPreset = moodFromDamage(emotionalDamage);
  const theme = getMoodTheme(mood);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!partnerName.trim()) {
        toast.error("Please enter their name or nickname.");
        return;
      }
      if (!timeInvested || Number(timeInvested) <= 0) {
        toast.error("Time invested must be at least 1 month.");
        return;
      }

      setShowOverlay(true);
      await new Promise((r) => setTimeout(r, 1500));
      setLoading(true);
      try {
        const res = await fetch("/api/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            yourName: yourName.trim(),
            partnerName: partnerName.trim(),
            timeInvested: Number(timeInvested),
            moneySpent: Number(moneySpent) || 0,
            emotionalDamage,
            betrayalLevel,
            note: note.trim(),
            anonymous,
            tone,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Something went wrong.");
        }

        const { slug } = await res.json();
        toast.success("Receipt created. You may now proceed with healing.");
        router.push(`/receipt/${slug}`);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to create receipt.");
      } finally {
        setLoading(false);
        setShowOverlay(false);
      }
    },
    [yourName, partnerName, timeInvested, moneySpent, emotionalDamage, betrayalLevel, note, anonymous, tone, router]
  );

  const betrayalLabel =
    betrayalLevel === 0
      ? "None"
      : betrayalLevel <= 2
        ? "Some"
        : betrayalLevel <= 4
          ? "Significant"
          : "Absolute";

  return (
    <>
    {/* Fullscreen loading overlay */}
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Spinning ring */}
          <div className="relative h-20 w-20">
            <svg className="h-20 w-20 animate-spin" viewBox="0 0 80 80">
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="5"
              />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke={theme.accent}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="160"
                strokeDashoffset="80"
              />
            </svg>
            <MascotSVG mood={mood} className="absolute inset-0 m-auto h-10 w-10" />
          </div>
          <motion.p
            className="mt-4 text-sm font-medium text-neutral-600"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Preparing your closure…
          </motion.p>
          <motion.p
            className="mt-1 text-xs text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            No refunds after this point.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>

    <Card className="w-full max-w-xl">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Your name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="yourName">Your name <span className="text-neutral-400">(optional)</span></Label>
            <Input
              id="yourName"
              placeholder="The main character"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              maxLength={80}
            />
          </div>

          {/* Partner name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="partnerName">
              The other party <span className="text-red-500">*</span>
            </Label>
            <Input
              id="partnerName"
              placeholder="Name, nickname, or 'that person'"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              required
              maxLength={80}
            />
          </div>

          {/* Time invested */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="timeInvested">
              Time invested (months) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="timeInvested"
              type="number"
              min={1}
              max={600}
              placeholder="e.g. 18"
              value={timeInvested}
              onChange={(e) => setTimeInvested(e.target.value)}
              required
            />
          </div>

          {/* Money spent */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="moneySpent">Money spent (₹)</Label>
            <Input
              id="moneySpent"
              type="number"
              min={0}
              placeholder="0"
              value={moneySpent}
              onChange={(e) => setMoneySpent(e.target.value)}
            />
            <span className="text-xs text-neutral-400">No judgement. Only maths.</span>
          </div>

          {/* Emotional damage slider */}
          <div className="flex flex-col gap-2">
            <Label>
              Emotional damage:{" "}
              <span style={{ color: theme.accent }} className="font-semibold">
                {emotionalDamage}/10 — {emotionalLabels[mood]}
              </span>
            </Label>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[emotionalDamage]}
              onValueChange={(v) => setEmotionalDamage(v[0])}
              aria-label="Emotional damage level"
              style={{ "--slider-accent": theme.accent } as React.CSSProperties}
              rangeClassName="!bg-[var(--slider-accent)]"
              thumbClassName="!border-[var(--slider-accent)]"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Calm</span><span>Reflective</span><span>Spicy</span><span>Nuclear</span>
            </div>
          </div>

          {/* Betrayal level slider */}
          <div className="flex flex-col gap-2">
            <Label>
              Betrayal level:{" "}
              <span className="text-neutral-600 font-semibold">
                {betrayalLevel}/5 — {betrayalLabel}
              </span>
            </Label>
            <Slider
              min={0}
              max={5}
              step={1}
              value={[betrayalLevel]}
              onValueChange={(v) => setBetrayalLevel(v[0])}
              aria-label="Betrayal level"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>0 = just incompatible</span><span>5 = villain origin story</span>
            </div>
          </div>

          {/* Tone toggle */}
          <div className="flex flex-col gap-2">
            <Label>Receipt tone</Label>
            <div className="flex gap-2">
              {toneOptions.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  className={`flex-1 rounded-xl px-4 py-3 text-base font-medium transition-all cursor-pointer border ${
                    tone === t.value
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note">Last words <span className="text-neutral-400">(optional)</span></Label>
            <Textarea
              id="note"
              placeholder="Say what you never said. Or don't."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              rows={3}
            />
            <span className="text-right text-xs text-neutral-400">
              {note.length}/300
            </span>
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id="anonymous"
              checked={anonymous}
              onCheckedChange={setAnonymous}
              aria-label="Hide my name on the receipt"
            />
            <Label htmlFor="anonymous" className="cursor-pointer">
              Go anonymous (witness protection mode)
            </Label>
          </div>

          {/* Mood preview with mascot */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mood}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-4 rounded-xl px-5 py-4 text-base transition-colors"
              style={{ backgroundColor: theme.accentLight, color: theme.accent }}
              role="status"
              aria-live="polite"
            >
              <MascotSVG mood={mood} className="h-12 w-12 flex-shrink-0 animate-float" />
              <div>
                <strong>{theme.label}</strong> — {theme.microcopy}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Fake legal disclaimer + Terms */}
          <div className="flex flex-col gap-1 text-xs text-neutral-400">
            <div className="flex items-center justify-between">
              <span>Refund policy: <strong className="text-neutral-500">absolutely not</strong></span>
              <TermsModal />
            </div>
            <span>Closure delivery time: varies. Replies: not included.</span>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-2 text-white"
            style={{ backgroundColor: theme.accent }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              "Generate receipt"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
    </>
  );
}
