---
name: feature-worktree
description: Sets up a dedicated git worktree, branch, and Astro dev server before any feature work or bug fix on the portfolio repo, then handles the commit / merge-to-main / cleanup loop after. Use whenever the user kicks off non-trivial editable work (e.g. "fix bug", "fix the X", "add a [feature|page|component|case study]", "redesign", "rework", "create a worktree", a numbered/batched bug list, or any change that will touch more than one file). Skip for read-only questions, single-line doc tweaks, and cases where the user explicitly says "edit on main" or "no worktree".
---

# Feature worktree flow

Julia's standing pattern for this repo: every meaningful change happens in
its own worktree under `/Users/jtang7/portfolio-<slug>/`, branched from
`main`, merged back via a `--no-ff` merge commit, and cleaned up the same
turn the merge happens.

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
2. Create the worktree + branch from `main`, install deps, and start the
   dev server in the background:

   ```bash
   cd /Users/jtang7/portfolio
   git worktree add ../portfolio-<slug> -b <slug> main
   cd ../portfolio-<slug>
   npm install
   npm run dev
   ```

   `npm run dev` should be backgrounded (block_until_ms: 0) so the agent
   doesn't sit on it. Astro picks the next free port if 4321 is taken;
   surface the actual local URL from the terminal output.

3. Report back to the user with the worktree path, the branch name, and
   the dev URL so they can open it in Cursor's Simple Browser.

4. Make all subsequent edits inside the worktree until the work is
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
   git worktree remove /Users/jtang7/portfolio-<slug>
   git branch -d <slug>
   git push origin --delete <slug>
   ```

3. If `git worktree remove` fails with `Operation not permitted` (the
   sandbox occasionally can't unlink a worktree directory), the worktree
   is usually already deregistered. Finish with `rm -rf` outside the
   sandbox:

   ```bash
   rm -rf /Users/jtang7/portfolio-<slug>
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
- Surface the dev URL after setup so the user can preview live; the dev
  server hot-reloads on every save.
