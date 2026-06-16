import Link from "next/link";
import { MascotSVG } from "@/components/mascot";

/**
 * Global 404 — shown for any URL that doesn't match a route.
 * Matches the brand voice: witty, empathetic, on-brand.
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <MascotSVG mood="reflective" className="mb-6 h-24 w-24" />
      <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
        Nothing here.
      </h1>
      <p className="mt-3 max-w-xs text-neutral-500">
        This page doesn&rsquo;t exist. But closure does.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Go home
        </Link>
        <Link
          href="/generate"
          className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-500 hover:text-neutral-900"
        >
          Create a receipt
        </Link>
      </div>
    </main>
  );
}
