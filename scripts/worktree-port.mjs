#!/usr/bin/env node
// Resolve a deterministic Astro dev-server port for the current git branch
// so each worktree always boots on the same URL. `main` stays on 4321 for
// muscle memory; every other branch is hashed into 4400-4999. Collisions
// across branches are possible but rare (600-port range, ~14% chance at 13
// branches by birthday paradox) and recoverable via `PORT=<n> npm run dev`.
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";

const branch = (() => {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "main";
  }
})();

const port =
  branch === "main" || branch === "HEAD"
    ? 4321
    : 4400 +
      (createHash("sha1").update(branch).digest().readUInt16BE(0) % 600);

process.stdout.write(String(port));
