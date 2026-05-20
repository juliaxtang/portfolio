# Interview prep

Private local tool. Not part of the deployed portfolio.

## Running

```sh
npm run dev:prep
```

Boots:
- Astro on `http://localhost:4321` — the UI at `/interview-prep`.
- Side-car on `http://localhost:4322` — owns role files. No API key, no AI calls.

## How it works

- Role data lives as JSON in `interview-prep/roles/<slug>.json` (gitignored).
- The side-car is a thin Node HTTP server. It does file CRUD only.
- AI work (JD digests, answer drafts, hiring-manager critique) is done by Claude Code in an interactive session — not by an API call.

## The flow

1. **Add a role** via the dashboard. If you provided a JD URL or company URL, the role is marked `pendingContext: true`.
2. **Click Generate / Regenerate** on a question after adding details. The question is marked `pendingRegen: true`.
3. The dashboard shows a banner: "N items queued for Claude Code."
4. **Open a Claude Code session** in this repo and run `/prep` (or just say "process pending interview prep"). Claude reads every role file, fetches any pending JDs, drafts answers, runs the `design-hiring-manager` subagent to tighten each draft, and writes results back.
5. Refresh the webpage to see the results.

## Voice rules (enforced in `.claude/commands/prep.md`)

- First person, conversational, specific.
- Never invent metrics or details.
- 150-220 words per response, max 3 paragraphs.
- Never uses em dashes (Julia's hard rule).
- Always runs the hiring-manager critique pass.

## Seed questions

The three prefilled questions on every role page:

1. Why are you looking to leave your current role, and what are you looking for in your next role?
2. Why [company]?
3. What role does AI play in your workflow?

To add more, edit `SEED_QUESTIONS` in `server.mjs`. Existing roles will not pick up new questions until you migrate their JSON files manually.

## Not deployed

`src/layouts/InterviewPrepLayout.astro` shows a placeholder when not in dev mode. The static production build will not surface real role data.
