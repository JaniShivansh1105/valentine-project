#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Launch Checklist Script
 *
 * Validates key functionality before deployment:
 * - OG endpoint responds with valid SVG
 * - Rate limiting is configured
 * - Required environment variables are set
 * - Fonts directory exists
 *
 * Run: node scripts/launch-checklist.js
 *
 * @module scripts/launch-checklist
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const TEST_SLUG = "test1234";

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────

const colours = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

function log(status, message) {
  const icon =
    status === "pass"
      ? `${colours.green}✓${colours.reset}`
      : status === "fail"
        ? `${colours.red}✗${colours.reset}`
        : status === "warn"
          ? `${colours.yellow}⚠${colours.reset}`
          : `${colours.cyan}ℹ${colours.reset}`;
  console.log(`  ${icon} ${message}`);
}

function header(title) {
  console.log(`\n${colours.cyan}━━━ ${title} ━━━${colours.reset}\n`);
}

/**
 * Make an HTTP(S) request and return response details.
 */
function request(url) {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { timeout: 10000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on("error", (err) => {
      resolve({ ok: false, status: 0, error: err.message, body: "" });
    });
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, status: 0, error: "Request timeout", body: "" });
    });
  });
}

// ─────────────────────────────────────────────────────────────
// CHECKS
// ─────────────────────────────────────────────────────────────

const checks = [];
let passed = 0;
let failed = 0;
let warned = 0;

function check(name, fn) {
  checks.push({ name, fn });
}

// Check 1: OG endpoint
check("OG endpoint returns valid SVG", async () => {
  const url = `${BASE_URL}/api/og?slug=${TEST_SLUG}`;
  const res = await request(url);

  if (!res.ok) {
    if (res.status === 503) {
      log("warn", `OG API disabled (503). Enable with NEXT_PUBLIC_FEATURE_OG_API=true`);
      return "warn";
    }
    log("fail", `OG endpoint returned ${res.status}: ${res.error || ""}`);
    return "fail";
  }

  const contentType = res.headers["content-type"] || "";
  if (!contentType.includes("svg")) {
    log("fail", `Expected SVG content-type, got: ${contentType}`);
    return "fail";
  }

  if (!res.body.includes("<svg") || !res.body.includes(TEST_SLUG.toUpperCase())) {
    log("fail", "SVG does not contain expected content");
    return "fail";
  }

  log("pass", "OG endpoint returns valid SVG with slug");
  return "pass";
});

// Check 2: Fonts directory
check("Fonts directory exists", async () => {
  const fontsPath = path.join(process.cwd(), "public", "fonts");
  if (fs.existsSync(fontsPath)) {
    const files = fs.readdirSync(fontsPath);
    if (files.some((f) => f.includes("Poppins"))) {
      log("pass", `Fonts directory exists with Poppins font`);
      return "pass";
    }
    log("warn", "Fonts directory exists but no Poppins font found");
    return "warn";
  }
  log("warn", "Fonts directory not found at public/fonts (PDF fonts may not embed)");
  return "warn";
});

// Check 3: Environment variables
check("Required environment variables", async () => {
  const vars = {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  };

  const missing = Object.entries(vars)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    log("warn", `Optional env vars not set: ${missing.join(", ")}`);
    return "warn";
  }

  log("pass", "All environment variables configured");
  return "pass";
});

// Check 4: Feature flags
check("Feature flags configuration", async () => {
  const flags = [
    "NEXT_PUBLIC_FEATURE_POLISHED_HERO",
    "NEXT_PUBLIC_FEATURE_OG_API",
    "NEXT_PUBLIC_FEATURE_ANALYTICS",
    "NEXT_PUBLIC_FEATURE_CONTENT_MODERATION",
  ];

  const enabled = flags.filter((f) => process.env[f] === "true");
  const disabled = flags.filter((f) => process.env[f] !== "true");

  if (enabled.length > 0) {
    log("info", `Enabled: ${enabled.map((f) => f.replace("NEXT_PUBLIC_FEATURE_", "")).join(", ")}`);
  }
  if (disabled.length > 0) {
    log("info", `Disabled: ${disabled.map((f) => f.replace("NEXT_PUBLIC_FEATURE_", "")).join(", ")}`);
  }

  log("pass", "Feature flags reviewed");
  return "pass";
});

// Check 5: Reports directory
check("Reports storage directory", async () => {
  const dataPath = path.join(process.cwd(), ".data");
  const reportsPath = path.join(dataPath, "reports.json");

  if (!fs.existsSync(dataPath)) {
    log("warn", ".data directory not found (will be created on first report)");
    return "warn";
  }

  if (!fs.existsSync(reportsPath)) {
    log("warn", "reports.json not found (will be created on first report)");
    return "warn";
  }

  log("pass", "Reports storage configured");
  return "pass";
});

// Check 6: Homepage loads
check("Homepage loads successfully", async () => {
  const res = await request(BASE_URL);

  if (!res.ok) {
    log("fail", `Homepage returned ${res.status}`);
    return "fail";
  }

  if (!res.body.includes("Closure") && !res.body.includes("closure")) {
    log("warn", "Homepage loaded but may not contain expected content");
    return "warn";
  }

  log("pass", "Homepage loads successfully");
  return "pass";
});

// Check 7: API create endpoint responds
check("Create API endpoint configured", async () => {
  // Just check it returns 400 for empty body (not 500)
  const url = `${BASE_URL}/api/create`;

  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.request(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      },
      (res) => {
        if (res.statusCode === 400) {
          log("pass", "Create API responds correctly to invalid input");
          resolve("pass");
        } else if (res.statusCode === 429) {
          log("pass", "Create API rate limiting active");
          resolve("pass");
        } else {
          log("warn", `Create API returned unexpected status: ${res.statusCode}`);
          resolve("warn");
        }
      }
    );
    req.on("error", (err) => {
      log("fail", `Create API error: ${err.message}`);
      resolve("fail");
    });
    req.write("{}");
    req.end();
  });
});

// ─────────────────────────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n${colours.cyan}╔════════════════════════════════════════════╗${colours.reset}`);
  console.log(`${colours.cyan}║  CLOSURE RECEIPT — LAUNCH CHECKLIST        ║${colours.reset}`);
  console.log(`${colours.cyan}╚════════════════════════════════════════════╝${colours.reset}`);
  console.log(`\n${colours.dim}Base URL: ${BASE_URL}${colours.reset}`);

  header("Running Checks");

  for (const { name, fn } of checks) {
    console.log(`\n${colours.dim}Checking: ${name}${colours.reset}`);
    try {
      const result = await fn();
      if (result === "pass") passed++;
      else if (result === "fail") failed++;
      else if (result === "warn") warned++;
    } catch (err) {
      log("fail", `Error: ${err.message}`);
      failed++;
    }
  }

  header("Summary");

  console.log(`  ${colours.green}Passed:${colours.reset}  ${passed}`);
  console.log(`  ${colours.yellow}Warnings:${colours.reset} ${warned}`);
  console.log(`  ${colours.red}Failed:${colours.reset}  ${failed}`);

  if (failed > 0) {
    console.log(`\n${colours.red}❌ Some checks failed. Please fix before launch.${colours.reset}\n`);
    process.exit(1);
  } else if (warned > 0) {
    console.log(`\n${colours.yellow}⚠ All checks passed with warnings. Review before launch.${colours.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colours.green}✅ All checks passed! Ready for launch.${colours.reset}\n`);
    process.exit(0);
  }
}

// Check if server is running
console.log(`\n${colours.dim}Checking if server is running at ${BASE_URL}...${colours.reset}`);
request(BASE_URL).then((res) => {
  if (!res.ok && res.status === 0) {
    console.log(`\n${colours.yellow}⚠ Server not running at ${BASE_URL}${colours.reset}`);
    console.log(`${colours.dim}Start the server with 'npm run dev' and try again.${colours.reset}`);
    console.log(`${colours.dim}Or set NEXT_PUBLIC_BASE_URL to your deployment URL.${colours.reset}\n`);
    process.exit(1);
  }
  run();
});
