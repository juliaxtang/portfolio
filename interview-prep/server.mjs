#!/usr/bin/env node
/**
 * Interview-prep side-car.
 *
 * Plain Node HTTP server. Owns the role JSON files. NO AI calls — all
 * generation work is done by Claude Code in a session. The webpage flags
 * items as "pending" (pendingContext on the role, pendingRegen on each
 * question), and Claude Code's /prep command reads those, processes them,
 * and writes the results back.
 */

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROLES_DIR = path.join(__dirname, "roles");
const PORT = parseInt(process.env.PREP_PORT || "4322");

// Resume tailoring config. The base resume HTML lives in the user's local
// Documents folder (not in this repo); tailored PDFs land in a sibling folder.
const RESUME_BASE_HTML =
  process.env.RESUME_BASE_HTML ||
  "/Users/jtang7/Documents/job profile/resume-prose.html";
const TAILORED_DIR =
  process.env.TAILORED_DIR || "/Users/jtang7/Documents/job profile/tailored";
const PDF_SCRIPT = path.join(__dirname, "generate-pdf.mjs");

// Git author for auto-sync commits. Reads from PREP_GIT_EMAIL/PREP_GIT_NAME
// env vars first, else falls back to the personal-portfolio defaults.
const GIT_EMAIL = process.env.PREP_GIT_EMAIL || "juliaxtang@gmail.com";
const GIT_NAME = process.env.PREP_GIT_NAME || "Julia Tang";
const SYNC_DEBOUNCE_MS = 30_000;

// ---------- git auto-sync ----------
function git(args) {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd: ROLES_DIR }, (err, stdout, stderr) => {
      if (err) reject(new Error((stderr || err.message).trim()));
      else resolve(stdout.trim());
    });
  });
}

const syncState = {
  lastSyncAt: null,
  lastError: null,
  inProgress: false,
  pendingChanges: false,
  debounceTimer: null,
};

async function syncToGithub() {
  if (syncState.inProgress) return;
  syncState.inProgress = true;
  syncState.lastError = null;
  try {
    const status = await git(["status", "--porcelain"]);
    if (!status) {
      syncState.pendingChanges = false;
      syncState.lastSyncAt = new Date().toISOString();
      return;
    }
    await git(["add", "-A"]);
    const ts = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    await git([
      "-c",
      `user.email=${GIT_EMAIL}`,
      "-c",
      `user.name=${GIT_NAME}`,
      "commit",
      "-m",
      `sync ${ts}`,
    ]);
    await git(["push"]);
    syncState.lastSyncAt = new Date().toISOString();
    syncState.pendingChanges = false;
    console.log(`[sync] pushed at ${syncState.lastSyncAt}`);
  } catch (e) {
    syncState.lastError = e.message;
    console.error(`[sync] failed: ${e.message}`);
  } finally {
    syncState.inProgress = false;
  }
}

function scheduleSync() {
  syncState.pendingChanges = true;
  if (syncState.debounceTimer) clearTimeout(syncState.debounceTimer);
  syncState.debounceTimer = setTimeout(() => {
    syncState.debounceTimer = null;
    syncToGithub();
  }, SYNC_DEBOUNCE_MS);
}

const SEED_QUESTIONS = [
  {
    id: "why-leaving",
    prompt:
      "Why are you looking to leave your current role, and what are you looking for in your next role?",
  },
  { id: "why-company", prompt: "Why [company]?" },
  { id: "ai-workflow", prompt: "What role does AI play in your workflow?" },
];

async function listRoles() {
  await fs.mkdir(ROLES_DIR, { recursive: true });
  const files = await fs.readdir(ROLES_DIR);
  const roles = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(ROLES_DIR, f), "utf8");
      roles.push(JSON.parse(raw));
    } catch {}
  }
  return roles.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
}

async function readRole(slug) {
  try {
    const raw = await fs.readFile(path.join(ROLES_DIR, `${slug}.json`), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeRole(role) {
  role.updatedAt = new Date().toISOString();
  await fs.mkdir(ROLES_DIR, { recursive: true });
  const file = path.join(ROLES_DIR, `${role.slug}.json`);
  await fs.writeFile(file, JSON.stringify(role, null, 2));
  scheduleSync();
  return role;
}

async function deleteRole(slug) {
  try {
    await fs.unlink(path.join(ROLES_DIR, `${slug}.json`));
    scheduleSync();
    return true;
  } catch {
    return false;
  }
}

// Shell out to generate-pdf.mjs. The sheet HTML is piped on stdin (it can be
// large with embedded edits) and the script returns one line of JSON on stdout.
function runPdfScript(args, stdin) {
  return new Promise((resolve, reject) => {
    const proc = execFile(
      process.execPath,
      [PDF_SCRIPT, ...args],
      { maxBuffer: 16 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) return reject(new Error((stderr || err.message).trim()));
        try {
          resolve(JSON.parse(stdout.trim().split("\n").pop()));
        } catch (e) {
          reject(new Error(`pdf script bad output: ${e.message}\n${stdout}\n${stderr}`));
        }
      },
    );
    proc.stdin.end(stdin);
  });
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function emptyRole(input) {
  const slug =
    input.slug || slugify(`${input.company || "company"}-${input.title || "role"}`);
  const now = new Date().toISOString();
  return {
    slug,
    title: input.title || "",
    company: input.company || "",
    companyUrl: input.companyUrl || "",
    jdUrl: input.jdUrl || "",
    status: input.status || "saved",
    createdAt: now,
    updatedAt: now,
    jdSummary: "",
    companyContext: "",
    pendingContext: false,
    notes: { recruiter: "", hiringManager: "", panel: "", offer: "" },
    pendingTailor: false,
    tailorExtra: "",
    tailored: null,
    questions: Object.fromEntries(
      SEED_QUESTIONS.map((q) => [
        q.id,
        {
          prompt: q.prompt,
          response: "",
          extraDetails: "",
          pendingRegen: false,
          updatedAt: "",
        },
      ]),
    ),
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return json(res, 204, {});

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split("/").filter(Boolean);

  try {
    if (req.method === "GET" && url.pathname === "/api/sync") {
      return json(res, 200, {
        lastSyncAt: syncState.lastSyncAt,
        lastError: syncState.lastError,
        inProgress: syncState.inProgress,
        pendingChanges: syncState.pendingChanges,
        debounced: syncState.debounceTimer != null,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/sync") {
      if (syncState.debounceTimer) {
        clearTimeout(syncState.debounceTimer);
        syncState.debounceTimer = null;
      }
      await syncToGithub();
      return json(res, 200, {
        lastSyncAt: syncState.lastSyncAt,
        lastError: syncState.lastError,
        pendingChanges: syncState.pendingChanges,
      });
    }

    if (req.method === "GET" && url.pathname === "/api/roles") {
      return json(res, 200, await listRoles());
    }

    if (req.method === "POST" && url.pathname === "/api/roles") {
      const body = await readBody(req);
      const role = emptyRole(body);
      if (await readRole(role.slug)) {
        return json(res, 409, { error: "slug already exists" });
      }
      // Mark for Claude Code to fetch JD + company context on next /prep run.
      if (role.jdUrl || role.companyUrl) role.pendingContext = true;
      await writeRole(role);
      return json(res, 201, role);
    }

    if (parts[0] === "api" && parts[1] === "roles" && parts[2]) {
      const slug = parts[2];
      const role = await readRole(slug);

      if (req.method === "GET" && parts.length === 3) {
        return role ? json(res, 200, role) : json(res, 404, { error: "not found" });
      }

      if (req.method === "PATCH" && parts.length === 3) {
        if (!role) return json(res, 404, { error: "not found" });
        const body = await readBody(req);
        const next = { ...role, ...body };
        if (body.notes) next.notes = { ...role.notes, ...body.notes };
        await writeRole(next);
        return json(res, 200, next);
      }

      if (req.method === "DELETE" && parts.length === 3) {
        const ok = await deleteRole(slug);
        return json(res, ok ? 200 : 404, { ok });
      }

      if (req.method === "POST" && parts[3] === "queue-context") {
        if (!role) return json(res, 404, { error: "not found" });
        role.pendingContext = true;
        await writeRole(role);
        return json(res, 200, role);
      }

      if (req.method === "POST" && parts[3] === "queue-tailor") {
        if (!role) return json(res, 404, { error: "not found" });
        const body = await readBody(req);
        role.pendingTailor = true;
        if (typeof body.tailorExtra === "string") role.tailorExtra = body.tailorExtra;
        await writeRole(role);
        return json(res, 200, role);
      }

      if (req.method === "POST" && parts[3] === "measure-tailored") {
        if (!role) return json(res, 404, { error: "not found" });
        const body = await readBody(req);
        const html = typeof body.html === "string" ? body.html : role?.tailored?.html;
        if (!html) return json(res, 400, { error: "no html to measure" });
        const out = await runPdfScript([
          "measure",
          "--base",
          RESUME_BASE_HTML,
        ], html);
        return json(res, 200, out);
      }

      if (req.method === "POST" && parts[3] === "tailored.pdf") {
        if (!role) return json(res, 404, { error: "not found" });
        if (!role.tailored?.html)
          return json(res, 400, { error: "role has no tailored html yet" });
        await fs.mkdir(TAILORED_DIR, { recursive: true });
        const safeCompany = (role.company || "Untitled").replace(/[\/\\]/g, "-");
        const pdfPath = path.join(TAILORED_DIR, `Julia Tang - Resume - ${safeCompany}.pdf`);
        const out = await runPdfScript(
          ["pdf", "--base", RESUME_BASE_HTML, "--out", pdfPath],
          role.tailored.html,
        );
        role.tailored = {
          ...role.tailored,
          pdfPath: out.pdfPath || null,
          fillRatio: out.fillRatio,
          pages: out.pages,
          warnings: out.warnings || [],
          ats: out.ats || null,
          updatedAt: new Date().toISOString(),
        };
        await writeRole(role);
        return json(res, 200, { ...out, pdfPath });
      }

      if (req.method === "POST" && parts[3] === "queue-regen") {
        if (!role) return json(res, 404, { error: "not found" });
        const body = await readBody(req);
        const questionId = body.questionId;
        const q = role.questions[questionId];
        if (!q) return json(res, 400, { error: "unknown questionId" });
        if (typeof body.extraDetails === "string") q.extraDetails = body.extraDetails;
        q.pendingRegen = true;
        await writeRole(role);
        return json(res, 200, role);
      }
    }

    return json(res, 404, { error: "no route" });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`interview-prep side-car running on http://localhost:${PORT}`);
  console.log("  (file CRUD only — AI work is done by Claude Code via /prep)");
  console.log(
    `  auto-sync: pushes to origin/main after ${SYNC_DEBOUNCE_MS / 1000}s of inactivity`,
  );
});

// On clean shutdown, flush any pending sync so nothing is lost.
process.on("SIGINT", async () => {
  if (syncState.debounceTimer) {
    clearTimeout(syncState.debounceTimer);
    console.log("[sync] flushing on shutdown...");
    await syncToGithub();
  }
  process.exit(0);
});
