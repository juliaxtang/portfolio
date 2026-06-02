# Interview decks — Snap case studies

Sparse, slide-by-slide spec for Figma Slides. Designed for "less reading, more listening" pacing (~30s avg per slide).

## Final lineup

**Topic Chats anchors all three calls.** Snapchat Games is the universal second.

| Role | Anchor | Second |
|---|---|---|
| Patreon (community / discovery) | Topic Chats | Snapchat Games |
| Pinterest (discovery / social) | Topic Chats | Snapchat Games |
| Reddit (Growth, retention from SEO) | Topic Chats | Snapchat Games |

Tappy Cloud and Festival Mode keep their existing Figma decks but sit out this loop. (Tappy Cloud reads as senior-with-platform-instinct at staff bar.)

## Files

### Deck specs
- [`topic-chats-anchor.md`](./topic-chats-anchor.md) — **universal sparse spine, 20 slides, ~9 min.** Role-neutral.
- [`topic-chats-role-variants.md`](./topic-chats-role-variants.md) — slide 1 framing + key speaker-note diffs per role.
- [`snapchat-games-second.md`](./snapchat-games-second.md) — **universal sparse spine, 12 slides, ~5–6 min.** Role-neutral.
- [`snapchat-games-role-variants.md`](./snapchat-games-role-variants.md) — handoff line + tie-back speaker notes + close per role.

### Build resources (`build-resources/`)
- [`README.md`](./build-resources/README.md) — fonts, colors, icons, library setup checklist
- [`gradient-brand.svg`](./build-resources/gradient-brand.svg), [`gradient-soft.svg`](./build-resources/gradient-soft.svg), [`gradient-aurora.svg`](./build-resources/gradient-aurora.svg) — drag into Figma
- [`gradients-preview.html`](./build-resources/gradients-preview.html) — open in browser to preview / export PNG if needed
- [`slide-templates.md`](./build-resources/slide-templates.md) — detailed component spec for all 6 templates
- [`template-previews.html`](./build-resources/template-previews.html) — **visual reference for each template**, open in browser while building
- [`per-slide-checklist.md`](./build-resources/per-slide-checklist.md) — flat row-by-row checklist for filling all 32 slides

## Time budget (30-min HM screen)

- 15 min intros + Q&A
- 60-sec framing slide (slide 1 of Topic Chats anchor)
- ~9 min Topic Chats anchor (20 sparse slides)
- ~6 min Snapchat Games second (12 sparse slides)
- 2–3 min buffer for interruptions

**Total: ~32 sparse slides for the design portion.** That's right-sized for your style (one beat per slide, talk track carries the meaning).

## Figma Slides workflow

1. **Duplicate your existing deck file** (the one with intro + Tappy + Festival).
2. **Add two new sections:** Topic Chats anchor (20 frames) + Snapchat Games second (12 frames). One master deck, never fork per role.
3. **Build role variants by duplicating slide 1 three times** (Patreon / Pinterest / Reddit framing). Hide the two you're not using before each call.
4. **Paste role-specific speaker notes** into Figma Slides presenter notes from the `*-role-variants.md` files.
5. **Pull all visual assets from** `/Users/jtang7/portfolio/public/projects/topic-chats/` and `/snapchat-games/`. Drag-drop into Figma — already on-brand, already sized.
6. **Hide appendix slides** in their own section. Show inline only if the conversation invites them.

## Key pacing notes

- Slide 6 of Topic Chats ("Not a content problem. A concurrency problem.") — **pause before clicking next**. Let it land.
- Slide 12 of Topic Chats (one signal, five surfaces) — **dwell longer for Pinterest** (this is your hero slide for them).
- Slide 14 of Topic Chats (entry point constraint) — **dwell longer for Reddit** (Reddit Growth panel cares most).
- Slide 9 of Games (failed first pitch) — **say it on purpose**. The killed pitch is the staff signal.

## Stress-test questions to rehearse

Each spine file has its own cheat sheet. The biggest three to drill:

1. *"A decision where data and judgment disagreed?"*
2. *"Why is the Topic Chats entry point buried in Friends feed? Why not fight for prominence?"*
3. *"What was the strongest argument *against* the sports wedge, and what would have changed your mind?"*

Tone rule for #2: *"I deliberately didn't fight for…"* — never *"I couldn't get…"*. Claim it as strategy.
