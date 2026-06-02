#!/usr/bin/env node
/**
 * generate-pdf.mjs — render a tailored resume to a one-page ATS-safe PDF.
 *
 * Two subcommands:
 *   measure  → returns { contentHeightPx, printableHeightPx, fillRatio, pages }
 *   pdf      → writes the PDF and returns the same fields plus pdfPath
 *
 * Reads the tailored sheet HTML on stdin. Loads the base resume-prose.html
 * for its <head> (fonts, CSS tokens, print styles) and swaps the
 * <article class="sheet">…</article> block for whatever was piped in.
 *
 * Fit loop (CSS-only, deterministic). The skill is responsible for content-
 * level fit (which bullets to include). This script only nudges typography:
 *   - overflow (>1 page): shrink body 10.5pt → 10pt → 9.5pt, tighten leading
 *   - underflow (<90%):  expand body 10.5pt → 11pt, loosen leading
 * Locked sections (header, awards, education, sidebar lists) keep their
 * declared sizes so they can't shrink below readable.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ATS_LINT = path.join(__dirname, "ats-lint.mjs");

const ARGS = parseArgs(process.argv.slice(2));

const PAGE_WIDTH_IN = 8.5;
const PAGE_HEIGHT_IN = 11;
const DPI = 96;
const PRINTABLE_PX = PAGE_HEIGHT_IN * DPI; // 1056

// Fit ladder. Each rung is a CSS override applied in addition to base styles.
// "shrink" rungs target overflow; "expand" rungs target underflow.
const LADDER = [
  { name: "base", css: "" },
  {
    name: "shrink-1",
    css: `.job-body { font-size: 12px; line-height: 1.5; }
          .job + .job { margin-top: 9px; }`,
  },
  {
    name: "shrink-2",
    css: `.job-body { font-size: 11.5px; line-height: 1.45; }
          .job + .job { margin-top: 8px; }
          section.cv-section + section.cv-section { margin-top: 12px; }`,
  },
  {
    name: "shrink-3",
    css: `.job-body { font-size: 11px; line-height: 1.4; }
          .job-body + .job-body { margin-top: 6px; }
          .job + .job { margin-top: 7px; }
          section.cv-section + section.cv-section { margin-top: 10px; }`,
  },
];
const EXPAND_LADDER = [
  {
    name: "expand-1",
    css: `.job-body { font-size: 13px; line-height: 1.6; }
          .job + .job { margin-top: 13px; }`,
  },
  {
    name: "expand-2",
    css: `.job-body { font-size: 13.5px; line-height: 1.65; }
          .job + .job { margin-top: 15px; }
          section.cv-section + section.cv-section { margin-top: 18px; }`,
  },
];

function runAtsLint(pdfPath, sourceHtmlPath) {
  return new Promise((resolve, reject) => {
    execFile(
      process.execPath,
      [ATS_LINT, "--pdf", pdfPath, "--source-html", sourceHtmlPath],
      { maxBuffer: 8 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) return reject(new Error((stderr || err.message).trim()));
        try {
          resolve(JSON.parse(stdout.trim().split("\n").pop()));
        } catch (e) {
          reject(new Error(`ats-lint bad output: ${e.message}\n${stdout}\n${stderr}`));
        }
      },
    );
  });
}

async function readStdin() {
  return new Promise((resolve, reject) => {
    let buf = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (buf += c));
    process.stdin.on("end", () => resolve(buf));
    process.stdin.on("error", reject);
  });
}

function parseArgs(argv) {
  const sub = argv[0];
  const opts = { sub };
  for (let i = 1; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith("--")) opts[k.slice(2)] = argv[++i];
  }
  return opts;
}

function spliceSheet(baseHtml, sheetInner) {
  // Replace the <article class="sheet" id="sheet">…</article> block. Anchor
  // on the opening tag with id="sheet" so we don't accidentally match a
  // nested sheet (there isn't one, but be defensive).
  const open = baseHtml.indexOf('<article class="sheet"');
  if (open < 0) throw new Error("base template missing <article class=\"sheet\">");
  const tagEnd = baseHtml.indexOf(">", open);
  const close = baseHtml.indexOf("</article>", tagEnd);
  if (close < 0) throw new Error("base template missing </article>");
  return (
    baseHtml.slice(0, tagEnd + 1) +
    "\n" +
    sheetInner +
    "\n" +
    baseHtml.slice(close)
  );
}

function injectStyles(html, css) {
  if (!css.trim()) return html;
  const headEnd = html.indexOf("</head>");
  if (headEnd < 0) return html;
  const tag = `<style id="fit-overrides">${css}</style>`;
  return html.slice(0, headEnd) + tag + html.slice(headEnd);
}

async function renderAndMeasure(page, html) {
  await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.evaluate(() => document.fonts && document.fonts.ready ? document.fonts.ready : null).catch(() => {});
  // Emulate print so @media print rules apply (this is what the PDF sees).
  await page.emulateMediaType("print");
  // Sheet element holds the resume content. In print mode the sheet expands
  // to natural height; document height is what matters for pagination.
  const result = await page.evaluate(() => {
    const sheet = document.getElementById("sheet");
    return {
      sheetHeight: sheet ? sheet.scrollHeight : null,
      docHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
    };
  });
  const contentPx = Math.max(result.sheetHeight || 0, result.bodyHeight || 0);
  return {
    contentHeightPx: contentPx,
    printableHeightPx: PRINTABLE_PX,
    fillRatio: contentPx / PRINTABLE_PX,
    pages: Math.max(1, Math.ceil(contentPx / PRINTABLE_PX)),
  };
}

async function main() {
  if (!ARGS.sub || (ARGS.sub !== "measure" && ARGS.sub !== "pdf")) {
    console.error("usage: generate-pdf.mjs <measure|pdf> --base <path> [--out <pdf>]");
    process.exit(2);
  }
  if (!ARGS.base) {
    console.error("missing --base");
    process.exit(2);
  }
  if (ARGS.sub === "pdf" && !ARGS.out) {
    console.error("missing --out");
    process.exit(2);
  }

  const sheetInner = await readStdin();
  if (!sheetInner.trim()) {
    console.error("empty stdin (sheet HTML required)");
    process.exit(2);
  }
  const baseHtml = await fs.readFile(ARGS.base, "utf8");
  const composedBase = spliceSheet(baseHtml, sheetInner);

  const browser = await puppeteer.launch({ headless: "new" });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: Math.round(PAGE_WIDTH_IN * DPI), height: PRINTABLE_PX });

    // Fit loop. Try base, then shrink rungs until ≤1 page or rungs exhausted.
    // If base is under 90%, try expand rungs.
    let chosen = LADDER[0];
    let lastMetric = await renderAndMeasure(page, injectStyles(composedBase, chosen.css));
    const trace = [{ rung: chosen.name, ...lastMetric }];

    if (lastMetric.fillRatio > 1.0) {
      for (let i = 1; i < LADDER.length; i++) {
        const rung = LADDER[i];
        const m = await renderAndMeasure(page, injectStyles(composedBase, rung.css));
        trace.push({ rung: rung.name, ...m });
        chosen = rung;
        lastMetric = m;
        if (m.fillRatio <= 1.0) break;
      }
    } else if (lastMetric.fillRatio < 0.9) {
      for (const rung of EXPAND_LADDER) {
        const m = await renderAndMeasure(page, injectStyles(composedBase, rung.css));
        trace.push({ rung: rung.name, ...m });
        // Only adopt if we move closer to 1.0 without going over.
        if (m.fillRatio <= 1.0 && m.fillRatio > lastMetric.fillRatio) {
          chosen = rung;
          lastMetric = m;
        } else if (m.fillRatio > 1.0) {
          break;
        }
      }
      // Re-render the chosen rung so the page state matches what we'll PDF.
      await renderAndMeasure(page, injectStyles(composedBase, chosen.css));
    }

    const warnings = [];
    if (lastMetric.fillRatio > 1.0) warnings.push("content still overflows after shrink ladder; trim bullets");
    if (lastMetric.fillRatio < 0.85) warnings.push("page under 85% full; add an evidence-backed bullet");

    const out = {
      sub: ARGS.sub,
      rung: chosen.name,
      ...lastMetric,
      warnings,
      trace,
    };

    if (ARGS.sub === "pdf") {
      await fs.mkdir(path.dirname(ARGS.out), { recursive: true });
      await page.pdf({
        path: ARGS.out,
        width: `${PAGE_WIDTH_IN}in`,
        height: `${PAGE_HEIGHT_IN}in`,
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      out.pdfPath = ARGS.out;

      // ATS compliance gate. Run the lint against the freshly written PDF.
      // Hard failures delete the file so we don't ship a non-compliant resume.
      const sourceHtmlPath = path.join(path.dirname(ARGS.out), `.${path.basename(ARGS.out)}.source.html`);
      await fs.writeFile(sourceHtmlPath, injectStyles(composedBase, chosen.css));
      try {
        const lint = await runAtsLint(ARGS.out, sourceHtmlPath);
        out.ats = lint;
        if (!lint.pass) {
          await fs.unlink(ARGS.out).catch(() => {});
          out.pdfPath = null;
          out.warnings = [...(out.warnings || []), "PDF deleted: ATS lint hard failures (see ats.hardFailures)"];
        }
      } finally {
        await fs.unlink(sourceHtmlPath).catch(() => {});
      }
    }

    process.stdout.write(JSON.stringify(out) + "\n");
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e.stack || e.message);
  process.exit(1);
});
