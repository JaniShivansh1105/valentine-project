import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { ValentineBackground } from "@/components/valentine-bg";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Closure Receipt — Close the tab, keep the glow",
  description:
    "Turn your breakup into a receipt. Share it, download it, and move on.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Closure Receipt",
    description: "No refunds. Just receipts — close the tab and glow up.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Closure Receipt",
    description: "No refunds. Just receipts — close the tab and glow up.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning className="min-h-dvh antialiased" style={{ fontFamily: "var(--font-body)" }}>
        <ValentineBackground />
        <div className="relative z-10 flex min-h-dvh flex-col">
          {children}
          <footer className="mt-auto py-6 text-center text-xs text-neutral-400 no-print">
            <p>Built for reflection, not revenge.</p>
            <p className="mt-1">
              Created by{" "}
              <a
                href="https://www.linkedin.com/in/shivansh-jani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-neutral-600 underline underline-offset-2 hover:text-blue-600 transition-colors"
              >
                Shivansh Jani
                <svg className="inline h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </p>
          </footer>
        </div>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
