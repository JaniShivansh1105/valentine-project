import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GenerateForm } from "./generate-form";

export const metadata: Metadata = {
  title: "Create your Receipt — Closure Receipt",
  description: "Fill in the details and generate your breakup receipt.",
};

export default function GeneratePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="mb-8 w-full max-w-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
      <h1
        className="mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Create your receipt
      </h1>
      <GenerateForm />
    </main>
  );
}
