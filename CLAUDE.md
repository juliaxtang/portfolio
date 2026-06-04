# Portfolio — agent guide

Astro 5 portfolio site, MDX-driven case studies. This file tells future Claude
sessions how to add a new case study without re-deriving the conventions.

## Project shape

```
src/
  content/
    config.ts                 — Zod schema for the `projects` collection
    projects/<slug>.mdx       — one case study per file
  components/
    case-study/
      Hero.astro              — auto-rendered from frontmatter
      Section.astro           — vertical block; eyebrow + title + body
      Figure.astro            — single image (narrow / wide / bleed)
      Video.astro             — autoplaying inline video
      TwoUp.astro             — two-column side-by-side
      Stats.astro             — grid container
      Stat.astro              — one oversized metric tile
      Quote.astro             — pulled blockquote
      MoreWork.astro          — auto-rendered footer
  layouts/
    BaseLayout.astro          — site chrome (header, footer, fonts)
    CaseStudyLayout.astro     — wraps every case-study page
  pages/
    product-design/[...slug].astro  — dynamic route, do not edit per case
public/
  projects/<slug>/*           — assets for that case study
```

## How to add a new case study

1. Drop assets in `public/projects/<slug>/` (use kebab-case filenames).
2. Create `src/content/projects/<slug>.mdx`. Copy the frontmatter from
   `festival-mode.mdx` and adapt.
3. Compose the body using the imports listed below. There is **no fixed
   structure** — one case study can be five `<Section>`s, another can be a
   single `<Video>` and one paragraph. Layout consistency comes from the
   components, not from a forced template.
4. `npm run build` — the dynamic route picks it up automatically; the
   "more work" section on every other case study links to the new one.

## Frontmatter schema (strict)

See [src/content/config.ts](src/content/config.ts) for the canonical Zod
schema. Required: `title`, `summary`. The `summary` doubles as the meta
description, the social card subtitle, and the "more work" tile copy, so
keep it 1 sentence.

`order` controls the sort in `MoreWork`. Lower numbers appear first.

`accent` is an optional CSS color used by `<Hero>`'s background gradient
to give a case study its own tonal flavor (see Festival Mode using Tinder's
festival coral). Falls back to `--brand-primary`.

## Component vocabulary

All case-study components live in `src/components/case-study/`. The .mdx file
imports each one it actually uses — Astro tree-shakes the rest.

```mdx
import Section from "../../components/case-study/Section.astro";
import Figure from "../../components/case-study/Figure.astro";
import Video from "../../components/case-study/Video.astro";
import TwoUp from "../../components/case-study/TwoUp.astro";
import Stats from "../../components/case-study/Stats.astro";
import Stat from "../../components/case-study/Stat.astro";
import Quote from "../../components/case-study/Quote.astro";
```

### `<Section eyebrow="Overview" title="...">`
Vertical block. Defaults to a centered narrow column for prose. Pass `wide`
to fill the content max width — useful when the body is mostly grids of
media. Inside, headings rendered as Markdown (`### ...`) get the right
typographic style automatically.

### `<Figure src alt caption? width? frame? aspect?>`
Single image. `width`: `narrow` (default, fits prose column), `wide` (fits
content max), `bleed` (full viewport). `frame` adds a soft surface card
around the image — use it for mobile UI screenshots so they don't float in
raw space. `aspect` is a CSS aspect-ratio string (e.g. `"4/3"`).

### `<Video src poster? caption? width? loop? controls?>`
Autoplaying, muted, looping video. Same width modifiers as `<Figure>`.

### `<TwoUp ratio? gap? wide?>`
Two-column container. `ratio`: `"1:1"` (default), `"1:2"`, or `"2:1"`.
Stacks on mobile. Children render in column order.

### `<Stats cols? wide?>` + `<Stat value label caption?>`
Use for outcome metrics. `cols`: 2 / 3 / 4. Stat values use the display
serif for numeric impact. **Never invent metrics** — if the source copy is
qualitative ("more conversations"), use a qualitative value glyph (`↑`,
`↗`) instead of a fabricated multiplier.

### `<Quote attribution?>`
Pulled testimonial / research quote. Children become the body.

## Hard rules

- **Never invent metrics, dates, or attributions.** If the audit doesn't
  have a number, write the qualitative claim and use a glyph for the
  `<Stat value>`.
- **No em dashes (`—`) in copy.** Use commas, colons, periods, or hyphens.
  This is a hard preference; see the auto-memory.
- **Light/soft brand only.** No dark canvas backgrounds, no high-saturation
  single-accent treatments. The pastel system is intentional.
- Don't add per-case-study one-off components inside the `.mdx`. If a
  pattern repeats, promote it to `src/components/case-study/`.
- Don't hotlink `framerusercontent.com`. Download assets to
  `public/projects/<slug>/` so the site is self-contained.

## Styling

All visual tokens live in [src/styles/tokens.css](src/styles/tokens.css)
(font families, color, spacing scale, radii, motion). Never hard-code hex
colors or pixel values inside a component or .mdx — pull from tokens. The
case-study components are already wired up to the tokens; new components
should follow.

## Audit / source content

[AUDIT.md](AUDIT.md) has the original Framer site inventory: routes,
images, page outlines, palette. Use it as the starting point when porting
a new page from `julia-tang.framer.ai`.

To re-capture body copy from the Framer source:

```bash
curl -sL "https://julia-tang.framer.ai/Product-Design/<Slug>" \
  -A "Mozilla/5.0" -o .tmp/<slug>.html
```

Framer's HTML is server-rendered, so body text and image URLs are present
without running JS. See `festival-mode.mdx` for what a fully-ported page
looks like.

## Exemplar to copy from

[src/content/projects/festival-mode.mdx](src/content/projects/festival-mode.mdx).
It uses every component except `<Video>` and `<Quote>`, and shows the
typical rhythm: Overview → Background → Strategy → Design → Outcomes.

## Git workflow

The full setup → merge → cleanup loop lives in
[.cursor/skills/feature-worktree/SKILL.md](.cursor/skills/feature-worktree/SKILL.md)
and auto-applies whenever a session is about to make non-trivial code
changes. Read that skill at the start of any feature, bug-fix, or
redesign session and follow it end-to-end.

Quick reference if you're not loading the skill:

- Feature work happens on a dedicated branch in its own worktree
  (`git worktree add ../portfolio-<slug> -b <slug> main`), not on `main`.
- After a branch is merged into `origin/main`, ALWAYS clean up in the
  same turn: stop any dev server, `git worktree remove <path>`,
  `git branch -d <branch>`, `git push origin --delete <branch>`.
- Commit messages on `main` are a single long paragraph explaining what
  AND why, no bullet lists, no em dashes. Bring branches in with
  `git merge --no-ff` so the merge commit is preserved in the graph.
