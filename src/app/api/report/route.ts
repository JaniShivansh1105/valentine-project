/**
 * Report API Endpoint
 *
 * POST /api/report
 *
 * Accepts reports for inappropriate receipts.
 * Stores minimal metadata in .data/reports.json for review.
 *
 * @module api/report/route
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface Report {
  id: string;
  slug: string;
  reason?: string;
  timestamp: string;
  ip: string;
}

// ─────────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), ".data");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

/**
 * Ensure the data directory and reports file exist.
 */
async function ensureReportsFile(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(REPORTS_FILE);
  } catch {
    await fs.writeFile(REPORTS_FILE, "[]", "utf-8");
  }
}

/**
 * Read existing reports.
 */
async function getReports(): Promise<Report[]> {
  await ensureReportsFile();
  const data = await fs.readFile(REPORTS_FILE, "utf-8");
  return JSON.parse(data);
}

/**
 * Save reports to file.
 */
async function saveReports(reports: Report[]): Promise<void> {
  await ensureReportsFile();
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2), "utf-8");
}

/**
 * Generate a simple report ID.
 */
function generateReportId(): string {
  return `RPT-${Date.now().toString(36).toUpperCase()}`;
}

// ─────────────────────────────────────────────────────────────
// RATE LIMITING
// ─────────────────────────────────────────────────────────────

const reportHits = new Map<string, number>();
const REPORT_COOLDOWN_MS = 60_000; // 1 minute between reports per IP

function isReportRateLimited(ip: string): boolean {
  const now = Date.now();
  const lastReport = reportHits.get(ip);

  if (lastReport && now - lastReport < REPORT_COOLDOWN_MS) {
    return true;
  }

  reportHits.set(ip, now);
  return false;
}

// ─────────────────────────────────────────────────────────────
// API HANDLER
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Get IP for rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limit check
  if (isReportRateLimited(ip)) {
    return NextResponse.json(
      { error: "Please wait before submitting another report." },
      { status: 429 }
    );
  }

  // Parse body
  let body: { slug?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  // Validate slug
  if (!body.slug || typeof body.slug !== "string") {
    return NextResponse.json(
      { error: "Missing receipt slug." },
      { status: 400 }
    );
  }

  // Create report
  const report: Report = {
    id: generateReportId(),
    slug: body.slug.slice(0, 32), // Limit slug length
    reason: typeof body.reason === "string" ? body.reason.slice(0, 500) : undefined,
    timestamp: new Date().toISOString(),
    ip: ip.slice(0, 45), // Limit IP length (for IPv6)
  };

  // Save report
  try {
    const reports = await getReports();
    reports.push(report);
    await saveReports(reports);
  } catch (error) {
    console.error("[Report API] Failed to save report:", error);
    return NextResponse.json(
      { error: "Failed to submit report. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Report submitted. We'll review this receipt." },
    { status: 201 }
  );
}
