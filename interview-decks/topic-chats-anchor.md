# Topic Chats — anchor case study (universal sparse spine)

Slide-by-slide spec. **~18 slides, ~9 min talk track** at sparse pacing (~30s avg per slide, with some dwell and some rapid-fire).

This is the role-neutral spine. For per-role framing slide content + key speaker-note diffs, see [`topic-chats-role-variants.md`](./topic-chats-role-variants.md).

## How to read this file

Each slide is one beat. **On-slide content is intentionally minimal** — usually one visual or one short line. The speaker note carries the meaning. Built for "less reading, more listening" pacing.

Format per slide:
- **Visual** — exact asset path from `/Users/jtang7/portfolio/public/projects/topic-chats/` or description
- **On-slide text** — literal text on the slide (or "none")
- **Talk track (~Ns)** — what you say out loud

---

## Section 1 — The inherited state (3 slides, ~55s)

### Slide 1 — Framing (60s)
**Visual:** title card, no image
**On-slide text:** see role-variants file (3 lines, ~10 words each)
**Talk track (~60s):** see role-variants file

### Slide 2 — What I inherited
**Visual:** `/projects/topic-chats/inherited-state.png` — full bleed, no overlay
**On-slide text:** none
**Talk track (~15s):** "Topic Chats was Snap's bet on public conversation. When I took it over, the surface worked — but the product didn't."

### Slide 3 — The numbers
**Visual:** large type, no image
**On-slide text:** **94%** first-time joiners · **73%** posted once and never returned
**Talk track (~20s):** "94% of messages from first-time joiners. 73% one-and-done. Most people said hi, got no response, and left. The team had been treating this as a content quality problem."

---

## Section 2 — The reframe (3 slides, ~65s)

### Slide 4 — The hi problem
**Visual:** `topic-chats-hi-problem-timestamps.png` — full bleed, no annotation
**On-slide text:** none
**Talk track (~20s):** "When I pulled the timestamps, the story changed."

### Slide 5 — Clustered windows
**Visual:** same image with a single callout overlay
**On-slide text:** "10-minute windows"
**Talk track (~20s):** "The 'hi' posts were clustered in ten-minute windows. People dropped in, scanned for a live conversation, and left when they didn't find one."

### Slide 6 — The reframe lands
**Visual:** dark slide, one centered line
**On-slide text:** **"Not a content problem. A concurrency problem."**
**Talk track (~25s):** *Pause before clicking next.* "Not a content problem. A concurrency problem. That reframe set the rest of the work — where to bet, how to design the chat, how to bring people back the moment it was live."

---

## Section 3 — The wedge (2 slides, ~45s)

### Slide 7 — Where concurrency already lived
**Visual:** `case-for-sports-and-live-events1.png` (category comparison)
**On-slide text:** "On-topic rate by category"
**Talk track (~25s):** "I cut the data by category. Generic interest chats were the worst — people didn't know what to talk about. Sports were the opposite: on-topic, time-bound, naturally concurrent."

### Slide 8 — The wedge
**Visual:** `case-for-sports-and-live-events2.png` + text
**On-slide text:** **"Sports as the wedge"**
**Talk track (~20s):** "I narrowed the roadmap to live events, sports as the proving ground. Not to fix all topic chats — to find the wedge where concurrency already existed and prove the model there."

---

## Section 4 — The scoreboard (2 slides, ~45s)

### Slide 9 — The scoreboard
**Visual:** `topic-chat-scoreboard.gif` — full bleed
**On-slide text:** none
**Talk track (~30s):** "Inside the chat, the most leveraged move was anchoring it in something *actually* live. Real-time score, clock, key moments — the conversation reacts to a real event instead of inventing one. Every scoreboard moment is shareable, which turned the chat into a source of distribution."

### Slide 10 — A spine, not decoration
**Visual:** scoreboard reduced, single callout text
**On-slide text:** **"A spine, not decoration"**
**Talk track (~15s):** "The scoreboard isn't decoration. It's the spine the conversation hangs off."

---

## Section 5 — Live state, system-wide (3 slides, ~65s)

### Slide 11 — One surface
**Visual:** `live-badge-friends-feed.png` centered, alone
**On-slide text:** "Friends feed"
**Talk track (~20s):** "The harder problem was *outside* the chat. Snapchat had no shared language for 'live.' I designed one signal — starting in the Friends feed."

### Slide 12 — All five
**Visual:** 5-up grid — `live-badge-friends-feed.png`, `live-badge-discover.png`, `live-badge-search-results.png`, `live-events-on-map.png`, `live-activity-widget.png`
**On-slide text:** **"One signal, five surfaces"**
**Talk track (~25s):** "Then Discover, Search, the Map, and iOS Live Activity. Each surface has a different contract — editorial, intent-based, ambient, social, system-level — and the signal had to fit all of them without losing meaning."

### Slide 13 — The principle
**Visual:** dark slide, one line
**On-slide text:** **"One glance, anywhere in the app, to know something is happening now."**
**Talk track (~20s):** *Read the line out loud.* "That was the design principle."

---

## Section 6 — Growth under constraint (3 slides, ~70s)

### Slide 14 — Name the constraint
**Visual:** dark slide, two short lines
**On-slide text:** **"The entry point was buried."** / **"That was a deliberate call."**
**Talk track (~30s):** "Quick aside, because it'll come up. The dedicated entry point for Topic Chats was buried in the Friends feed. That was a deliberate call. Spending political capital to win prime real estate before we'd proven product-market fit would have burned the bet. So I designed growth around the constraint."

### Slide 15 — Four mechanisms
**Visual:** 4-up thumbnail grid — push notification screenshot, Friends feed billboard, profile pill, live-state badging (use any of the live-state thumbnails)
**On-slide text:** **"Live notifications · Billboards · Profile pills · Live-state"**
**Talk track (~25s):** "Four mechanisms. Push notifications fired on live events. Top-of-Friends-feed billboards tied to active games. Topic Chat pills on profiles for social discovery. The live-state signal you just saw, doing growth work. Pull users in at the moment the chat was most valuable."

### Slide 16 — The biggest lever
**Visual:** dark slide, one line
**On-slide text:** **"Notifications were the biggest lever."**
**Talk track (~15s):** "Of those four, notifications were the biggest. They deserve their own beat."

---

## Section 7 — Notifications (2 slides, ~50s)

### Slide 17 — The taxonomy
**Visual:** NotificationTaxonomy component imagery, or the 4-tier diagram
**On-slide text:** "Activity about me · Friends · Chat momentum · New chat recs"
**Talk track (~30s):** "Built the product's first notification system from scratch. Four tiers, ranked by personal relevance. Frequency tied to ranking. Every notification had to answer: 'is something happening here I'd want to be part of?' Untiered notifications cost trust and train users to mute — the taxonomy let me pull the frequency lever hard on the tiers that earned it."

### Slide 18 — The lift
**Visual:** large type, no image
**On-slide text:** **"+32K DAU"** / "U.S. Android · AB-tested vs. notifications-off"
**Talk track (~20s):** "32 thousand additional daily actives, AB-tested against a notifications-off control. The lift came mostly from the top two tiers."

---

## Section 8 — The proof (2 slides, ~50s)

### Slide 19 — March Madness, single chat
**Visual:** large type, no image
**On-slide text:** **"52K"** / "peak concurrent in a single chat"
**Talk track (~25s):** "March Madness was the stress test. Three weeks, every loop firing at once. Peak concurrent in a single chat hit 52 thousand — a floor the inherited product never reached."

### Slide 20 — What it added up to
**Visual:** stats grid
**On-slide text:** **~71K** incremental DAU · **~208K** msgs/week · **25–45K** sends/day sustained
**Talk track (~25s):** "71 thousand incremental U.S. DAU. 200K+ messages a week. 25 to 45 thousand sends per day sustained across the tournament. The wedge plus the system around it compounded. Topic Chats became a stronger product once it stopped trying to be everything at once."

---

**Total: 20 slides, ~8–9 min talk track.** Slide 1 (framing) and any role-specific tie-back line at the close come from the role-variants file.

---

## Appendix slides (hidden, pull up if asked)

Build these but hide them in Figma. Show inline only if the conversation invites them.

### A1 — Supporting moves: send limits
**Visual:** `before-send-limit.png` / `after-send-limit.png` before/after
**Talk:** rate cap that catches spammers, not regulars

### A2 — Supporting moves: Mark as Off Topic
**Visual:** `mark-as-off-topic.gif` + 3× adoption stat
**Talk:** one-tap moderation, 3× adoption vs. the formal report flow, surfaced signal the report flow never saw

### A3 — Sharing & invite loops
**Visual:** `sharing-topic-chats-sender.gif` + `sharing-topic-chats-receiver.png`
**Talk:** turn chat into distribution, preserve live context off-platform

### A4 — What's next
**Visual:** `associated-topic-chats-nba01.png` + `cross-posting-content.png` + `topic-chats-polls-voting.gif`
**Talk:** discovery flywheel between teams and chats, cross-posting, time-bound polls. **Plus the entry point redesign** — now that the product has earned the right.

### A5 — Tradeoff / regret
**Talk:** the daily-challenges-as-solo-loop assumption that landed in group sends instead — would scope leaderboards earlier next time

---

## Stress-test / objection cheat sheet

### "A decision where data and judgment disagreed?"

> Data said generic interest chats had higher *volume*. Judgment (and the timestamp reframe) said sports had higher *concurrency*. I picked concurrency against the volume signal. Validated by the +32K DAU and the March Madness numbers.

### "Why is the entry point buried? Why not fight for something prominent?"

> "Topic Chats was an inherited MVP with weak signal, and a prime entry point in the app is a finite resource you have to earn. Spending political capital to win that slot before we had product-market fit would have burned the bet. So I treated the constrained entry point as the design problem: where does this product naturally show up in a user's existing behavior? That reframed growth around live moments — sports notifications, billboard placements during games, live-state signal anywhere a friend was already active — which pulled people in at the moment the chat was most valuable, not by interrupting them on the home surface. Notifications became our single biggest lever. Once the product was earning its keep, the conversation about a more prominent entry point became a different conversation."

**Tone:** *"I deliberately didn't fight for…"* — not *"I couldn't get…"*. Claim it as strategy.

### "What would you do with another quarter?"

> "Now that the product has earned the right, the entry point itself is the next unlock. Here's the sketch." (Have a 1-slide sketch ready in appendix.) Don't lead with this — close with it. Lead = apology. Close = roadmap.

### "What was the strongest argument *against* the sports wedge?"

> Probably: sports narrows the TAM and locks us into seasonal traffic. Counter-argument was right on its face. What would have changed my mind: if categorical concurrency analysis hadn't shown the gap so sharply, or if the operating cost of live-event integrations had been prohibitive. Neither was true. The wedge let us learn the loop first, then generalize.
