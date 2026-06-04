#!/usr/bin/env node
// Bootstrap a worktree's per-window Cursor identity:
//   - .vscode/settings.json  -> deterministic title-bar text + color
//   - .vscode/tasks.json     -> dev server auto-starts on folder open
//
// Idempotent (always overwrites both files). `.vscode/` is gitignored so
// these never travel between branches. Run once after creating a new
// worktree, or any time you want to regenerate the window identity.
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const branch = execSync("git rev-parse --abbrev-ref HEAD", {
  cwd: root,
  encoding: "utf8",
}).trim();

const hash = createHash("sha1").update(branch).digest();
const port = branch === "main" ? 4321 : 4400 + (hash.readUInt16BE(0) % 600);
const hue = hash.readUInt16BE(2) % 360;

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const activeBg = hslToHex(hue, 60, 48);
const inactiveBg = hslToHex(hue, 35, 60);

const settings = {
  "window.title": `\${rootName} :${port}`,
  "workbench.colorCustomizations": {
    "titleBar.activeBackground": activeBg,
    "titleBar.activeForeground": "#ffffff",
    "titleBar.inactiveBackground": inactiveBg,
    "titleBar.inactiveForeground": "#ffffffb3",
    "titleBar.border": activeBg,
    "statusBar.background": activeBg,
    "statusBar.foreground": "#ffffff",
    "statusBar.noFolderBackground": activeBg,
    "statusBarItem.hoverBackground": inactiveBg,
  },
};

const tasks = {
  version: "2.0.0",
  tasks: [
    {
      label: "Dev server",
      type: "shell",
      command: "npm run dev",
      isBackground: true,
      problemMatcher: [],
      runOptions: { runOn: "folderOpen" },
      presentation: {
        reveal: "always",
        panel: "dedicated",
        focus: false,
        clear: false,
      },
    },
  ],
};

const vscodeDir = join(root, ".vscode");
mkdirSync(vscodeDir, { recursive: true });
writeFileSync(
  join(vscodeDir, "settings.json"),
  JSON.stringify(settings, null, 2) + "\n",
);
writeFileSync(
  join(vscodeDir, "tasks.json"),
  JSON.stringify(tasks, null, 2) + "\n",
);

const url = `http://localhost:${port}`;
console.log(`worktree-setup: branch=${branch} port=${port}`);
console.log(`  wrote ${join(".vscode", "settings.json")}`);
console.log(`  wrote ${join(".vscode", "tasks.json")}`);
console.log(`  title bar -> ${activeBg}`);
console.log(`  dev URL   -> ${url}`);
console.log("");
console.log("Next:");
console.log(`  1. Open this worktree in its own Cursor window:`);
console.log(`       cursor ${root}`);
console.log(`  2. Allow automatic tasks when prompted (one-time per folder).`);
console.log(`  3. Cmd-Shift-P -> "Simple Browser: Show" -> ${url}`);
console.log(`     Drag the tab to the right editor group.`);
