# Per-slide build checklist

Mechanical fill-in for Step 6 of the build. Work top to bottom. Reference [`template-previews.html`](./template-previews.html) for the visual layout of each template.

**Asset root:** `/Users/jtang7/portfolio/public/projects/`
**Template names** (from `slide-templates.md`): T1 Title, T2 Big-stat, T3 Full-bleed, T4 Image+callout, T5 Grid, T6 Statement.

---

## Topic Chats — 20 slides

### Slide 1 — Framing
- **Template:** T1 Cover
- **Background:** `gradient-aurora.svg`
- **Eyebrow:** *(role-specific — see `topic-chats-role-variants.md`)*
- **Headline:** *(role-specific)*
- **Subhead:** *(role-specific)*
- **Page number:** off
- **→ Transition:** Dissolve

### Slide 2 — What I inherited
- **Template:** T3 Full-bleed
- **Asset:** `topic-chats/inherited-state.png` → layer `img / inherited`
- **On-slide text:** none
- **→ Transition:** Dissolve

### Slide 3 — The numbers
- **Template:** T2 Two-stat variant
- **Bg:** `bg/canvas`
- **Stat 1:** `94%` / "first-time joiners" / "of messages"
- **Stat 2:** `73%` / "posted once and never returned" / "of users"
- **Layer names:** `stat / left-primary`, `stat / right-primary`
- **→ Transition:** Dissolve

### Slide 4 — The hi problem
- **Template:** T3 Full-bleed
- **Asset:** `topic-chats/topic-chats-hi-problem-timestamps.png` → layer `img / timestamps`
- **On-slide text:** none
- **→ Transition:** **Smart Animate** (image persists into slide 5)

### Slide 5 — Clustered windows
- **Template:** T4 Image + callout
- **Asset:** `topic-chats/topic-chats-hi-problem-timestamps.png` → layer `img / timestamps` *(identical name to slide 4)*
- **Callout:** "10-minute windows"
- **Callout layer:** `callout / text`
- **Image position:** identical to slide 4 (Smart Animate will scale it to the left 70% if you reposition)
- **→ Transition:** Dissolve

### Slide 6 — The reframe lands
- **Template:** T6 Statement, **cool wash** (analytical reframe)
- **Bg:** `bg/sunken` (`#EFF5FA`)
- **Statement:** "Not a content problem. A concurrency problem." · `text/primary`
- **Layer name:** `statement / primary`
- **→ Transition:** Dissolve

### Slide 7 — Where concurrency lived
- **Template:** T4 Image + callout
- **Asset:** `topic-chats/case-for-sports-and-live-events1.png` → `img / category-chart`
- **Callout:** "On-topic rate by category"
- **→ Transition:** Smart Animate (if chart layouts match) or Dissolve

### Slide 8 — The wedge
- **Template:** T4 Image + callout
- **Asset:** `topic-chats/case-for-sports-and-live-events2.png` → `img / concurrent-chart`
- **Callout:** "Sports as the wedge"
- **→ Transition:** Dissolve

### Slide 9 — The scoreboard
- **Template:** T3 Full-bleed, mobile letterbox variant
- **Asset:** `topic-chats/topic-chat-scoreboard.gif` → `img / scoreboard`
- **Letterbox:** `bg/sunken` (`#EFF5FA`) left and right, optional 1px `border/subtle` hairline around mockup
- **→ Transition:** **Smart Animate** (image persists into slide 10)

### Slide 10 — A spine, not decoration
- **Template:** T4 Image + callout
- **Asset:** same scoreboard, same layer name `img / scoreboard`
- **Callout:** "A spine, not decoration"
- **Image scaled down** to make room for callout on right
- **→ Transition:** Dissolve

### Slide 11 — One surface
- **Template:** T3 single image, **positioned in eventual top-left grid cell**
- **Asset:** `topic-chats/live-badge-friends-feed.png` → `surface / friends-feed`
- **On-slide text:** "Friends feed" (Geist Mono 14px, below image as caption)
- **Critical:** position this image where it will sit on slide 12 (top-left of a 5-up grid), not centered on the canvas. This sets up the Smart Animate reveal.
- **→ Transition:** **Smart Animate**

### Slide 12 — All five
- **Template:** T5 5-up grid
- **Assets** (each in a grid cell, named identically across):
  - `surface / friends-feed` ← `topic-chats/live-badge-friends-feed.png` *(same layer name + position as slide 11)*
  - `surface / discover` ← `topic-chats/live-badge-discover.png`
  - `surface / search` ← `topic-chats/live-badge-search-results.png`
  - `surface / map` ← `topic-chats/live-events-on-map.png`
  - `surface / live-activity` ← `topic-chats/live-activity-widget.png`
- **Headline:** "One signal, five surfaces" → `headline / primary`
- **→ Transition:** Dissolve

### Slide 13 — The principle
- **Template:** T6 Statement, **canvas** (softest variant — this is a principle, not a hard pivot)
- **Bg:** `bg/canvas`
- **Statement:** "One glance, anywhere in the app, to know something is happening now." · `text/primary`
- **→ Transition:** Dissolve

### Slide 14 — Name the constraint
- **Template:** T6 Statement, **cool wash**, two-line variant (constraint reveal — clinical)
- **Bg:** `bg/sunken` (`#EFF5FA`)
- **Line 1:** "The entry point was buried." (Instrument Serif 96px, `text/primary`)
- **Line 2:** "That was a deliberate call." (Instrument Serif 60px, `text/secondary`)
- **Layer names:** `statement / primary`, `statement / secondary`
- **→ Transition:** Move In from bottom (mechanisms grid reveals)

### Slide 15 — Four mechanisms
- **Template:** T5 4-up grid (single row)
- **Assets:**
  - `mech / push` ← grab a notification screenshot from `topic-chats/notifications-activity-about-the-chat-1.png`
  - `mech / billboard` ← screenshot of Friends feed billboard if available; else a representative `live-badge-friends-feed.png`
  - `mech / profile-pill` ← screenshot of profile with Topic Chat pill; else a labeled placeholder
  - `mech / live-state` ← compact thumbnail of any live-badge surface
- **Headline:** "Live notifications · Billboards · Profile pills · Live-state"
- **→ Transition:** **Smart Animate** (the notification thumbnail scales up into slide 16)

### Slide 16 — The biggest lever
- **Template:** T6 Statement, **warm wash** (transitional / "let me dwell on this one")
- **Bg:** `bg/sunken-warm` (`#F4F0EA`)
- **Statement:** "Notifications were the biggest lever." · `text/primary`
- **Optional Smart Animate trick:** if you keep `mech / push` from slide 15 as a small thumbnail tucked to one side of slide 16, it scales up smoothly. Otherwise leave clean.
- **→ Transition:** Dissolve

### Slide 17 — The taxonomy
- **Template:** T4 Image + callout (or T3 with overlay)
- **Asset:** NotificationTaxonomy imagery — pull from any 2–3 notifications screenshots laid out as a quick taxonomy. Or screenshot the existing `NotificationTaxonomy` component from your portfolio.
- **Callout:** "4 tiers · ranked by personal relevance"
- **→ Transition:** Dissolve

### Slide 18 — The lift
- **Template:** T2 Single big-stat
- **Stat:** `+32K` / "DAU" / "U.S. Android · AB-tested vs. notifications-off"
- **Layer:** `stat / primary`, `stat / label`, `stat / caption`
- **→ Transition:** Dissolve (slow ~400ms — let it land)

### Slide 19 — 52K concurrent
- **Template:** T2 Single big-stat, **positioned in eventual top-left of results grid**
- **Stat:** `52K` / "peak concurrent in a single chat"
- **Layer:** `stat / primary`
- **Position:** top-left of canvas (where it'll sit in slide 20's grid)
- **→ Transition:** **Smart Animate**

### Slide 20 — Results grid
- **Template:** T2 3-stat row variant
- **Stats:**
  - `52K` / "peak concurrent" → `stat / primary` *(identical name + position as slide 19)*
  - `~71K` / "incremental DAU" → `stat / secondary-1`
  - `~208K` / "messages per week" → `stat / secondary-2`
  - Bottom caption: "25–45K sends/day sustained across March Madness"
- **→ Transition:** End of deck or Dissolve to next case study divider

---

## Snapchat Games — 12 slides

### Slide 1 — Buried in the carousel
- **Template:** T3 Full-bleed
- **Asset:** `snapchat-games/old-lens-carousel.gif` → `img / old-carousel`
- **On-slide text:** none (optional overlay headline: "Games were buried in lenses")
- **→ Transition:** Dissolve

### Slide 2 — Hyper-casual triptych
- **Template:** T5 3-up grid
- **Assets:**
  - `game / 1` ← `snapchat-games/early snapchat game 1.gif`
  - `game / 2` ← `snapchat-games/early snapchat games 2.gif`
  - `game / 3` ← `snapchat-games/early snapchat game 3.gif`
- **Headline:** "Hyper-casual. Solo. Buried."
- **→ Transition:** Dissolve

### Slide 3 — The data
- **Template:** T2 3-stat row
- **Stats:**
  - `30%` / "D1 retention" / "top game lenses"
  - `7.8%` / "Spotlight unlock" / "vs 1.1% benchmark"
  - *(optional third)* `7%` / "WAU 5+ days/wk"
- **→ Transition:** Dissolve

### Slide 4 — The call
- **Template:** T6 Statement, **warm wash** (human / personal-conviction moment)
- **Bg:** `bg/sunken-warm` (`#F4F0EA`)
- **Statement:** "I made the bet before anyone asked." · `text/primary`
- **→ Transition:** Dissolve

### Slide 5 — Two jobs
- **Template:** T6 light, two-column variant (or build a custom T4 with two stacked callouts)
- **Left column:** "Connections + Conversations" / "Games as a reason friends talk"
- **Right column:** "Growth + Resurrection" / "Games as a reason to open the app"
- **→ Transition:** Dissolve

### Slide 6 — Three initial bets
- **Template:** T5 3-up grid
- **Assets:**
  - `bet / chat-drawer` ← `snapchat-games/chat drawer - after.gif`
  - `bet / fullscreen` ← `snapchat-games/fullscreen-ux-1.mp4` (or a frame from it as a static image)
  - `bet / turn-based` ← `snapchat-games/snap-envelopes - after.png`
- **Headline:** "Chat drawer · Fullscreen UX · Turn-based fix"
- **→ Transition:** **Smart Animate** (cells stay; stats overlay in slide 7)

### Slide 7 — The aggregate
- **Template:** T2 3-stat row
- **Stats:**
  - `+178%` / "YoY engagement"
  - `+2.9M` / "Snaps (entrypoint)"
  - `+120%` / "Game video posts (iOS)"
- **→ Transition:** Dissolve

### Slide 8 — CEO quote
- **Template:** T6 Statement with attribution, **soft gradient** (biggest moment — earns the gradient)
- **Bg:** `gradient-soft.svg` (full bleed)
- **Statement:** *"How can we go big with games?"* (Instrument Serif italic 96px, `text/primary`)
- **Attribution:** "— Evan, CEO" (Geist Mono 24px, `text/tertiary`, right-aligned 56px below)
- **→ Transition:** Dissolve

### Slide 9 — Failed first pitch
- **Template:** T4 Image + callout
- **Asset:** any of `snapchat-games/snapchat-arcade-*.gif` (use 1) → `img / arcade-pitch`
- **Callout:** "First pitch: arcade economy. Killed it correctly."
- **→ Transition:** Dissolve

### Slide 10 — The category bet
- **Template:** T4 Image + callout (or T3 with overlay)
- **Asset:** `snapchat-games/hybrid-casual-revenue.png` → `img / category-chart`
- **Callout:** "Hyper-casual → hybrid-casual"
- **→ Transition:** Dissolve

### Slide 11 — System of surfaces
- **Template:** T5 6-up grid (3×2)
- **Assets:** mix of social-lane + passive-browse-lane surfaces
  - `surface / chat-drawer` ← `snapchat-games/chat drawer - after 2.gif`
  - `surface / friends-feed` ← `snapchat-games/games-entrypoint-friendsfeed.png`
  - `surface / calling` ← `snapchat-games/pillar2-live-multiplayer-oncall.gif`
  - `surface / camera-category` ← `snapchat-games/games-category-oncamera.mp4` (or still frame)
  - `surface / discover` ← `snapchat-games/games-in-discover-option2-carousel.gif`
  - `surface / spotlight` ← `snapchat-games/games-tab-in-spotlight-built.mp4` (or still)
- **Headline:** "Games as a system of surfaces, not one home"
- **→ Transition:** Dissolve

### Slide 12 — The result
- **Template:** T2 3-stat row variant
- **Stats:**
  - `30M` / "Games DAU"
  - `+2.9M` / "Snaps (entrypoint)"
  - `New squad` / "CEO-sponsored"
- **Caption:** "Games are at their best when they give friends a reason to talk."
- **→ Transition:** End of deck

---

## Smart Animate pairs — verify before rehearsal

These are the three "wow" moments. Each requires identical layer names on both slides.

| From | To | Persistent layer | What animates |
|---|---|---|---|
| TC 4 | TC 5 | `img / timestamps` | Image scales + callout fades in |
| TC 11 | TC 12 | `surface / friends-feed` | First cell stays, four more fly in to complete grid |
| TC 19 | TC 20 | `stat / primary` | 52K stays, two more stats appear beside it |

Optional bonus: TC 9 → TC 10 (`img / scoreboard` persists), Games 6 → Games 7 (cells stay, stats overlay).

After building, **rehearse each Smart Animate pair**. If it cuts instead of animating, the layer names don't match. Open both slides, fix the names, try again.

---

## Asset prep tip

Before building, copy all needed images into a Figma page called "Asset Library" inside your deck file. Group them by source: "Asset / Topic Chats / ..." and "Asset / Snap Games / ...". Then when filling slides, you drag from this in-file library instead of re-importing from the filesystem each time. ~10 min upfront, saves an hour over 32 slides.
