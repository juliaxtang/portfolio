#!/usr/bin/env node
/**
 * ats-lint.mjs — deterministic ATS-compliance check for a rendered resume PDF.
 *
 * Runs three families of checks. Hard failures mean the PDF will not survive
 * common ATS parsers (Greenhouse, Lever, Workday all share these failure
 * modes). Warnings are advisory.
 *
 *   1. Text extraction      — pdftotext returns a real text layer
 *   2. Required tokens      — name, email, phone, all employers, section heads
 *   3. HTML pitfall lint    — tables, image-as-text, missing font fallbacks
 *
 * Usage:
 *   node ats-lint.mjs --pdf <path> [--source-html <path>]
 *
 * Stdout: one line of JSON: { pass, hardFailures: [], warnings: [], extracted }
 */

import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REQUIRED_TOKENS = [
  { name: "Name", pattern: /Julia\s+Tang/i, kind: "hard" },
  { name: "Email", pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, kind: "hard" },
  { name: "Phone", pattern: /\b\d{3}[.\-\s]?\d{3}[.\-\s]?\d{4}\b/, kind: "hard" },
  { name: "Employer: Snap", pattern: /Snap\b/i, kind: "hard" },
  { name: "Employer: Tinder", pattern: /Tinder/i, kind: "hard" },
  { name: "Employer: Whip Media", pattern: /Whip\s+Media/i, kind: "hard" },
  { name: "Employer: Tangent", pattern: /Tangent/i, kind: "warn" },
  { name: "Section: Experience", pattern: /\bExperience\b/i, kind: "hard" },
  { name: "Section: Education", pattern: /\bEducation\b/i, kind: "hard" },
  { name: "Section: Skills", pattern: /\bSkills\b/i, kind: "warn" },
  { name: "Section: Awards", pattern: /\bAwards\b/i, kind: "warn" },
  // Date pattern: at least one parseable date range somewhere in the doc.
  {
    name: "Parseable dates",
    pattern: /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4}\s*[–\-]\s*(Present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})/i,
    kind: "hard",
  },
];

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith("--")) out[k.slice(2)] = argv[++i];
  }
  return out;
}

async function pdfToText(pdfPath) {
  // -layout preserves column order in two-column resumes; many ATS use this
  // mode (or its equivalent). If layout-mode loses content vs. raw mode, the
  // PDF has reading-order issues — we test both.
  const [layout, raw] = await Promise.all([
    execFileAsync("pdftotext", ["-layout", pdfPath, "-"], { maxBuffer: 8 * 1024 * 1024 }),
    execFileAsync("pdftotext", [pdfPath, "-"], { maxBuffer: 8 * 1024 * 1024 }),
  ]);
  return { layout: layout.stdout, raw: raw.stdout };
}

function lintHtml(html) {
  const findings = [];
  // Look only inside the sheet (skip toolbar, scripts).
  const sheetMatch = html.match(/<article class="sheet"[^>]*>([\s\S]*?)<\/article>/);
  const sheet = sheetMatch ? sheetMatch[1] : html;

  if (/<table[\s>]/i.test(sheet)) {
    findings.push({ kind: "hard", msg: "Contains <table>; many ATS parsers flatten table cells unpredictably." });
  }
  if (/<img\b/i.test(sheet)) {
    findings.push({ kind: "warn", msg: "Contains <img>; if it carries copy, ATS will miss it." });
  }
  // Standalone <svg> that contains <text> nodes is the real failure mode;
  // decorative SVG is fine. The base resume has no SVG, but tailored
  // variants might if the agent gets creative.
  if (/<svg[^>]*>[\s\S]*?<text\b/i.test(sheet)) {
    findings.push({ kind: "hard", msg: "Contains <svg><text>; ATS extracts SVG text inconsistently." });
  }
  // Font stack must include an ATS-safe fallback.
  const safeFonts = /(Helvetica|Arial|Calibri|Times|Georgia)/i;
  if (!safeFonts.test(html)) {
    findings.push({
      kind: "hard",
      msg: "No ATS-safe font in CSS font stack; add Helvetica/Arial/Calibri/Times fallback.",
    });
  }
  return findings;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.pdf) {
    process.stderr.write("usage: ats-lint.mjs --pdf <path> [--source-html <path>]\n");
    process.exit(2);
  }

  const hardFailures = [];
  const warnings = [];

  // ----- 1. Text extraction
  let extracted;
  try {
    extracted = await pdfToText(args.pdf);
  } catch (e) {
    process.stdout.write(
      JSON.stringify({
        pass: false,
        hardFailures: [`pdftotext failed: ${e.message}`],
        warnings: [],
      }) + "\n",
    );
    process.exit(0);
  }

  const text = extracted.layout || "";
  if (text.replace(/\s+/g, "").length < 500) {
    hardFailures.push(
      `Extracted text is too short (${text.replace(/\s+/g, "").length} chars). PDF may be image-only or have an encoding issue.`,
    );
  }
  // Reading-order sanity: if raw-mode extraction is dramatically shorter than
  // layout mode, the PDF probably has a content-stream ordering problem that
  // some ATS will trip on.
  const layoutLen = text.length;
  const rawLen = extracted.raw.length;
  if (rawLen > 0 && layoutLen > 0 && Math.abs(rawLen - layoutLen) / Math.max(rawLen, layoutLen) > 0.5) {
    warnings.push(
      `Layout vs. raw text length differ by >50% (${layoutLen} vs ${rawLen}). Reading order may be unstable across parsers.`,
    );
  }

  // ----- 2. Required tokens
  for (const t of REQUIRED_TOKENS) {
    if (!t.pattern.test(text)) {
      (t.kind === "hard" ? hardFailures : warnings).push(`Missing in PDF text: ${t.name}`);
    }
  }

  // ----- 3. HTML pitfall lint (if source provided)
  if (args["source-html"]) {
    try {
      const html = await fs.readFile(args["source-html"], "utf8");
      for (const f of lintHtml(html)) {
        (f.kind === "hard" ? hardFailures : warnings).push(`HTML: ${f.msg}`);
      }
    } catch (e) {
      warnings.push(`Could not read source-html: ${e.message}`);
    }
  }

  process.stdout.write(
    JSON.stringify({
      pass: hardFailures.length === 0,
      hardFailures,
      warnings,
      extractedChars: text.length,
    }) + "\n",
  );
}

main().catch((e) => {
  process.stderr.write((e.stack || e.message) + "\n");
  process.exit(1);
});
