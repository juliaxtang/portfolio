# Slide templates — Figma component spec

Six master frames cover every slide in the two decks. Build each as a Figma component (`Slide / Template / [Type]`) on a Templates page inside your shared library file. Once these are right, the entire deck is duplicate-and-fill.

**Canvas:** 1920×1080. **Default background:** `bg/canvas` (`#FDFCFA`). **Default text:** `text/primary` (`#15171C`).

All padding values reference the 4pt spacing scale from `tokens.css`: `s-8 = 32px`, `s-12 = 48px`, `s-16 = 64px`, `s-20 = 80px`, `s-24 = 96px`, `s-32 = 128px`.

---

## Template 1 — Title / Section divider

**Purpose:** Framing slide, section dividers between case studies, "what's next" closers.

**Background:** `gradient-aurora.svg` (full bleed) for cover slides. For mid-deck section dividers, use `bg/canvas` with a thin accent bar.

**Layers (named for Smart Animate):**
- `bg / aurora` — full-bleed gradient at z=0
- `eyebrow / text` — Geist Mono 16px, `text/tertiary`, uppercase, letter-spacing 0.08em. Positioned 96px from top-left.
- `headline / primary` — Instrument Serif 96px (slide/display-l), `text/primary`. Center-left aligned, max-width 1400px, vertically centered minus 40px.
- `subhead / secondary` — Geist Medium 28px (slide/subhead), `text/secondary`. Sits 40px below headline, max-width 1200px.
- `page-num` — Geist Mono 14px, `text/tertiary`. Bottom-right, 64px from edges.

**Padding:** 96px all sides for content; safe area = canvas minus 96px on every side.

**Variants to build:**
- Cover (with aurora bg, large eyebrow + headline)
- Section divider (canvas bg, thin `brand/primary` accent bar 4×120px above eyebrow)
- Closer (canvas bg, headline only, no subhead)

---

## Template 2 — Big-stat

**Purpose:** Numerical reveals — "+32K DAU", "52K concurrent", "30% D1 retention". Used heavily.

**Background:** `bg/canvas`.

**Layers:**
- `bg` — solid `bg/canvas`
- `stat / primary` — **Instrument Serif 180px** (slide/display-xl), `text/primary`, centered horizontally, vertically positioned at ~42% from top (slightly above center).
- `stat / label` — Geist Medium 28px, `text/secondary`, centered, 32px below stat.
- `stat / caption` — Geist Mono 16px, `text/tertiary`, centered, 16px below label. Optional.
- `page-num`

**Variants:**
- Single stat (most common)
- Two stats side-by-side (use a 2-col 50/50 layout, each centered in its half)
- Three stats (3-col, smaller display size — 120px instead of 180px)
- Four stats (2×2 grid, 96px display size — for results grid at end of deck)

**Critical layer naming:** when the same stat appears on consecutive slides (e.g., 52K on slide 19 then 52K + 3 more on slide 20), keep `stat / primary` as the layer name on both so Smart Animate tweens position and size.

---

## Template 3 — Full-bleed image

**Purpose:** Hero visuals — scoreboard GIF, inherited-state screenshots, full lens carousel.

**Background:** image fills frame edge-to-edge.

**Layers:**
- `img / [content-name]` — fill the frame entirely. Set as image fill on a 1920×1080 rectangle, or use Figma Slides' native image-frame.
- `page-num` — overlay on bottom-right, semi-transparent white at 60% opacity for legibility over varied imagery. Optional, skip for the most hero-feel slides.

**No padding.** The image *is* the slide.

**Variants:**
- Full bleed, no text
- Full bleed with single overlay headline (Instrument Serif 64px, white, dropshadow `0 4px 16px rgba(0,0,0,0.4)`, positioned bottom-left 96px from edges)

**Cropping rule:** if the source image is tall mobile (9:16), letterbox with `bg/sunken` (`#EFF5FA`) on left and right. Add a 1px `border/subtle` hairline around the mockup if it needs definition. Don't stretch. Don't use dark letterbox — off-brand.

---

## Template 4 — Image + single callout

**Purpose:** Images that need light annotation — timestamps with "10-minute windows" overlay, scoreboard with "spine, not decoration" label.

**Background:** `bg/canvas`.

**Layout:** image takes ~70% of canvas width, callout text occupies the remaining space.

**Layers:**
- `bg`
- `img / [content-name]` — left-aligned, max height 880px, padding 96px from top/left/bottom. Image scales to fit.
- `callout / text` — Geist Semibold 48px (slide/headline), `text/primary`, right side of canvas. Positioned to align with image vertical center. Max-width 480px.
- `callout / kicker` — optional Geist Mono 14px above callout, uppercase, `text/tertiary`.
- `page-num`

**Variants:**
- Image-left / callout-right (default)
- Image-center / callout-below (for very tall portrait images)
- Image-right / callout-left (mirror, alternate for visual rhythm)

---

## Template 5 — Multi-image grid

**Purpose:** Cross-surface displays (5-up live state surfaces), three-up wins (chat drawer / fullscreen / turn-based), four-up mechanisms (notifications/billboards/pills/badging).

**Background:** `bg/canvas`.

**Layout:** evenly spaced grid, all cells equal. Headline at top, optional captions per cell.

**Layers (5-up example):**
- `bg`
- `headline / primary` — Instrument Serif 64px or Geist Semibold 48px, top of canvas, padding 96px from top.
- `grid / container` — auto-layout frame, 96px horizontal padding, 48px gaps. Centered.
- `surface / [name-1]`, `surface / [name-2]`, ... — one image per cell, named semantically (e.g., `surface / friends-feed`, `surface / discover`).
- Per-cell caption (optional) — Geist Mono 14px, `text/tertiary`, below each image.
- `page-num`

**Variants:**
- 3-up horizontal (each cell 530×~680px)
- 4-up horizontal (each cell 392×~620px) or 2×2 (more breathing room)
- 5-up horizontal (each cell 320×~600px) — used for Topic Chats live state
- 6-up (3×2) for the Games "system of surfaces" slide

**Smart Animate pattern:** when this template follows a single-image slide (Template 3 or 4), put the *first cell* of the grid in the exact position the prior slide's image occupied. The other cells fly in to complete the grid. Name the first cell identically across both slides — that's the trick.

---

## Template 6 — Typographic statement

**Purpose:** Reframes, principles, transitions, killed-pitch admissions. The "let this land" slides.

**Brand note:** the portfolio brand is intentionally light/soft/pastel — dark canvas slides would feel off-brand. The differentiation between content slides and statement slides comes from **surface tint**, **type scale**, and **pacing**, not from inverting to dark. Your tokens system supports a dark mode but we're deliberately not pulling it forward into this deck.

**Background:** one of three light surfaces, chosen by mood:
- `bg/sunken` (`#EFF5FA`, cool blue-tint wash) — analytical reframes
- `bg/sunken-warm` (`#F4F0EA`, warm cream wash) — human moments
- `gradient-soft.svg` (pastel 3-stop) — biggest moments only, sparingly

**Layers:**
- `bg` — solid wash or gradient
- `statement / primary` — **Instrument Serif 96–120px** (slide/display-l), `text/primary`. Centered both axes. Max-width 1400px.
- `page-num` — `text/tertiary`

**Variants:**
- **Cool wash, single line** — analytical reframe (e.g., "Not a content problem. A concurrency problem.")
- **Cool wash, two-line stack** — constraint reveal (e.g., "The entry point was buried." / "That was a deliberate call."). Line 2: Instrument Serif 60px, `text/secondary`.
- **Warm wash, single line** — human moment (e.g., "I made the bet before anyone asked.")
- **Soft gradient with attribution** — biggest moments, e.g., the CEO quote. Quote in italic Instrument Serif 96px, attribution Geist Mono 24px `text/tertiary` 56px below, right-aligned.
- **Canvas, single line** — softest principle statements (e.g., the "one glance, anywhere in the app" principle)

**Pacing rule:** these slides need ~25s of talk time. Don't pile on. One thought per slide.

---

## Shared component conventions

### Persistent layers (every template includes these with identical names)

- `bg` — the background layer (color, gradient, or image)
- `page-num` — bottom-right page indicator (turn off for cover and full-bleed slides)
- *(optional)* `accent-bar` — 4px tall `brand/primary` strip 24px from bottom, full-width. Only on section dividers.

These names being **identical across every template** is what lets you Smart Animate the background to stay rock-solid while content above it changes.

### Layer naming convention for content

| Pattern | Example | Used when |
|---|---|---|
| `headline / primary` | "One signal, five surfaces" | Slide title |
| `headline / kicker` | "Section 5" | Above headline |
| `statement / primary` | "Not a content problem." | Big text moments |
| `img / [content-id]` | `img / scoreboard` | Any image |
| `surface / [name]` | `surface / friends-feed` | Cells in multi-image grids |
| `stat / primary` | "+32K" | Display number |
| `stat / label` | "DAU lift" | Descriptor under stat |
| `callout / text` | "A spine, not decoration" | Right-side callout |

When a layer carries from slide N to slide N+1, **use the identical name on both.** That's how Smart Animate identifies it.

---

## Build order (suggested)

Spend ~45 minutes on this and the rest of the deck flies.

1. **Library file setup:** create the file, add colors + text styles, drop in gradient SVGs.
2. **Template 6 first** (typographic statement) — simplest, validates your type styles.
3. **Template 2** (big-stat) — same type family, validates the display-xl size.
4. **Template 1** (title) — validates the aurora background + page number.
5. **Template 3** (full-bleed image) — drop in any test image and confirm the letterbox rule.
6. **Template 4** (image + callout) — validates auto-layout for the image+text split.
7. **Template 5** (multi-image grid) — most complex, do last. Build the 5-up variant; the 3-up and 4-up are derivatives.
8. **Publish the library.**
9. Switch to your interview deck file. Enable the library. Start duplicating.

---

## Quick reference — which template per slide

Cross-reference for the build phase. Pulls from the two anchor markdown files.

### Topic Chats (20 slides)

| Slide | Template | Variant |
|---|---|---|
| 1 Framing | T1 | Cover with aurora |
| 2 Inherited state | T3 | Full-bleed, no text |
| 3 The numbers | T2 | Two stats side-by-side |
| 4 The hi problem | T3 | Full-bleed, no text |
| 5 Clustered windows | T4 | Image + callout |
| 6 The reframe lands | T6 | Dark, single line |
| 7 Where concurrency lived | T4 | Image + callout |
| 8 The wedge | T4 | Image + callout |
| 9 The scoreboard | T3 | Full-bleed mobile (letterboxed) |
| 10 A spine, not decoration | T4 | Image + callout (or T6 cool wash) |
| 11 One surface | T3 or T5 (1-cell positioned) | See Smart Animate note |
| 12 All five | T5 | 5-up grid |
| 13 The principle | T6 | Dark or light |
| 14 Name the constraint | T6 | Dark, two lines |
| 15 Four mechanisms | T5 | 4-up grid |
| 16 The biggest lever | T6 | Dark, single line |
| 17 The taxonomy | T4 | Image + callout |
| 18 The lift (+32K) | T2 | Single big stat |
| 19 52K concurrent | T2 | Single big stat |
| 20 Results grid | T2 | 3-stat variant |

### Snapchat Games (12 slides)

| Slide | Template | Variant |
|---|---|---|
| 1 Buried carousel | T3 | Full-bleed |
| 2 Hyper-casual triptych | T5 | 3-up grid |
| 3 The data | T2 | 2-3 stats |
| 4 The call | T6 | Dark single line |
| 5 Two jobs | T6 or T4 | Light, two columns |
| 6 Three initial bets | T5 | 3-up grid |
| 7 The aggregate | T2 | 3-stat row |
| 8 CEO quote | T6 | Dark with attribution |
| 9 Failed first pitch | T4 | Image + callout |
| 10 The category bet | T4 | Image + callout |
| 11 System of surfaces | T5 | 6-up grid (3×2) |
| 12 The result | T2 | 3-stat variant |

Six templates do 32 slides. That's the leverage.
