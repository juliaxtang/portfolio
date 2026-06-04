---
name: feature-worktree
description: Sets up a dedicated git worktree, branch, and Astro dev server before any feature work or bug fix on the portfolio repo, then handles the commit / merge-to-main / cleanup loop after. Use whenever the user kicks off non-trivial editable work (e.g. "fix bug", "fix the X", "add a [feature|page|component|case study]", "redesign", "rework", "create a worktree", a numbered/batched bug list, or any change that will touch more than one file). Skip for read-only questions, single-line doc tweaks, and cases where the user explicitly says "edit on main" or "no worktree".
---

# Feature worktree flow

Julia's standing pattern for this repo: every meaningful change happens in
its own worktree under `/Users/jtang7/portfolio/.claude/worktrees/<slug>/`,
branched from `main`, merged back via a `--no-ff` merge commit, and cleaned
up the same turn the merge happens. Nesting worktrees under the project
folder (not as siblings) keeps them visible to Cursor's
`Git: Open Worktree in New Window` picker and matches the convention used
by `~/.claude/commands/worktree.md`. `.claude/` is already gitignored so
the worktree never travels.

## When to apply

Apply automatically at the start of any session whose intent matches:

- "fix [bug|issue]" / "fix the X" / a list of bugs to address
- "add [feature|page|component|case study|section]"
- "redesign", "rework", "refactor", "rewrite"
- "create a worktree" / "spin up a branch"
- Any plural / batched change request

Skip when:

- The user explicitly says "edit on main" or "no worktree"
- The change is a one-line doc tweak (CLAUDE.md, README, a comment)
  where branching is more friction than it's worth
- The session is a question, a code read, or a planning conversation

If unsure, ask once with two options ("worktree" / "edit on main") instead
of guessing.

## Setup workflow

1. Pick a kebab-case slug from the task. Keep it short and topical:
   `bug-fixes`, `hero-redesign`, `add-festival-mode`, `cleanup-cursor`.
2. Create the worktree + branch from `main`, install deps, bootstrap the
   per-window Cursor identity, and start the dev server in the background:

   ```bash
   cd /Users/jtang7/portfolio
   git worktree add .claude/worktrees/<slug> -b <slug> main
   cd .claude/worktrees/<slug>
   npm install
   node scripts/setup-worktree.mjs
   npm run dev
   ```

   `setup-worktree.mjs` writes `.vscode/settings.json` (deterministic
   title-bar text + color) and `.vscode/tasks.json` (auto-starts the dev
   server on folder open). `.vscode/` is gitignored so this is local
   only.

   `npm run dev` should be backgrounded (block_until_ms: 0). The port is
   resolved deterministically from the branch name by
   `scripts/worktree-port.mjs`, so a given branch always boots on the
   same URL (e.g. `visual/festival-mode` -> `4808`, `doodle-usability` ->
   `4556`). `main` stays on `4321` for muscle memory. The actual URL is
   printed by both scripts; surface it from the terminal output if there
   is any doubt.

3. Open the worktree in its own Cursor window so the code, the agent
   chat, and the live preview all live in one labeled, color-coded
   window. From inside the main `portfolio` Cursor window:
   `Cmd-Shift-P` -> `Git: Open Worktree in New Window` -> pick `<slug>`.
   Equivalent from any terminal:

   ```bash
   cursor /Users/jtang7/portfolio/.claude/worktrees/<slug>
   ```

   The first time a worktree opens, Cursor asks whether to allow the
   `folderOpen` task. Say yes once per folder. The dev server then auto
   starts on every subsequent open. Inside the new window:
   `Cmd-Shift-P` -> `Simple Browser: Show` -> the dev URL, then drag the
   tab to the right editor group. Cursor remembers the layout, so this
   is one-time per worktree.

4. Report back to the user with the worktree path, the branch name, and
   the dev URL.

5. Make all subsequent edits inside the worktree until the work is
   merged. Do not edit files in `/Users/jtang7/portfolio` directly while
   the feature branch is in flight.

## Merge workflow

When the user signals the work is done ("commit", "ship it", "merge to
main", "push to github"):

1. Run `git diff --stat` in the worktree so the user can confirm what's
   landing.
2. Commit on the feature branch with a single long-paragraph message in
   the existing house style: explains what AND why in one prose
   paragraph, no bullet lists, no em dashes (use commas, colons, or
   parens for connective tissue).
3. Push the feature branch:

   ```bash
   git push -u origin <slug>
   ```

4. Switch into the main worktree, fast-forward main, merge with a merge
   commit, and push:

   ```bash
   cd /Users/jtang7/portfolio
   git pull --ff-only origin main
   git merge --no-ff <slug> -m "Merge branch '<slug>'"
   git push origin main
   ```

   The `--no-ff` is required: `main` history is a sequence of merge
   commits, not a fast-forwarded line.

5. Sync every other live worktree to the new `main` so no feature
   branch silently drifts behind. Run this from the primary worktree
   right after the push, in the same turn:

   ```bash
   MERGED_WT=/Users/jtang7/portfolio/.claude/worktrees/<slug>
   git worktree list --porcelain | awk '/^worktree / { print $2 }' | \
     while read -r wt; do
       if [ "$wt" = "/Users/jtang7/portfolio" ] || [ "$wt" = "$MERGED_WT" ]; then
         continue
       fi
       echo "Syncing $wt"
       git -C "$wt" fetch origin main
       if ! git -C "$wt" merge --no-edit origin/main; then
         echo "  -> conflict in $wt, leave it for the user"
         git -C "$wt" merge --abort 2>/dev/null || true
       fi
     done
   ```

   Notes:
   - Covers every worktree on disk: nested ones under
     `/Users/jtang7/portfolio/.claude/worktrees/<slug>/` (the canonical
     location) and any leftover siblings at
     `/Users/jtang7/portfolio-<slug>/` from before the convention
     change. Both styles benefit from staying in sync with `main`.
   - The primary worktree at `/Users/jtang7/portfolio` is where the
     merge already happened, so it's skipped; the just-merged worktree
     is about to be removed in cleanup, so it's skipped too.
   - Each remaining worktree stays on its own feature branch; the sync
     brings the fresh `main` into it via a merge commit. Use merge (not
     rebase) so any pushed feature branch keeps its history.
   - If a worktree has uncommitted changes or conflicts that block the
     merge, `merge --abort` keeps it untouched and the path is
     surfaced; let the user pull manually when ready.

## Cleanup workflow (mandatory, same turn as the merge)

Never leave a merged branch or worktree behind. As soon as the merge
push succeeds, in the same agent turn:

1. Stop any dev server still running in the worktree. The reliable way
   is `pkill -f "astro dev"` (run with `required_permissions: ["all"]`
   so the sandbox doesn't block the SIGTERM).
2. Remove the worktree, delete the local branch, delete the remote
   branch:

   ```bash
   cd /Users/jtang7/portfolio
   git worktree remove .claude/worktrees/<slug>
   git branch -d <slug>
   git push origin --delete <slug>
   ```

3. If `git worktree remove` fails with `Operation not permitted` (the
   sandbox occasionally can't unlink a worktree directory), the worktree
   is usually already deregistered. Finish with `rm -rf` outside the
   sandbox:

   ```bash
   rm -rf /Users/jtang7/portfolio/.claude/worktrees/<slug>
   ```

   Then re-run the `git branch -d` and `git push origin --delete`
   commands; the deregistration only blocks the directory removal, not
   the branch deletes.

4. Verify with `git worktree list` (no `<slug>` entry) and
   `git branch -a | grep <slug>` (returns nothing).

## House rules recap

- Never push directly to `main` for feature work, always go through a
  worktree + branch.
- Never leave merged branches or worktrees behind, cleanup is part of
  the merge turn.
- No em dashes in commit messages or any copy in this codebase. Use
  commas, colons, periods, or hyphens.
- Use `--no-ff` merges so the branch boundary stays visible in the
  graph.
- After every push to `main`, sync every other live worktree so no
  feature branch silently falls behind the merged history.
- Surface the dev URL after setup so the user can preview live; the dev
  server hot-reloads on every save.
