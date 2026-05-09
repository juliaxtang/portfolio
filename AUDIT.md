# julia-tang.framer.ai — Inventory & Audit

Generated 2026-05-07 from a static fetch of the Framer site + parsing of its
JS bundles and search index. Some content is only assembled at runtime by
Framer's React runtime, so a live walk-through (screenshots + DevTools) is
still needed to fill in the gaps marked **TODO**.

---

## 1. Site map (scoped for the rebuild)

Rebuilding only these pages. Graphic Design and Motion Graphics from the
original Framer site are **out of scope**.

| Route                                | Page          | Source on Framer                          |
| ------------------------------------ | ------------- | ----------------------------------------- |
| `/`                                  | Home          | `/` on Framer                             |
| `/about`                             | About me      | **new** — not on Framer                   |
| `/resume`                            | Resume        | **new** — link/button that downloads PDF  |
| `/product-design/festival-mode`      | Festival Mode | `/Product-Design/Festival-Mode`           |
| `/product-design/tappy-cloud`        | Tappy Cloud   | `/Product-Design/Tappy-Cloud`             |
| `/product-design/custom-lists`       | Custom Lists  | `/Product-Design/Custom-Lists`            |
| `/product-design/tv-time-onboarding` | Onboarding    | `/Product-Design/tv-time-onboarding`      |

Nav on rebuild: **Work · About · Resume · Contact** (or similar — TBD with you).
The Framer footer's "Graphic Design / Motion Design" links are dropped.

## 2. Page outlines (from search index headings)

### Festival Mode
- H1: Festival Mode · Tappy Cloud · "A seasonal experience that allows festivalgoers to meet others going to the same festival." · "A multi-festival experience that allows both specificity and freedom of exploration"
- H2: "A new experience on Tinder Explore that allows festivalgoers to meet others going to the same festival." · Conversations · Likes Sent · Enabled future roadmap · Take a look at the case study below… · Check out some of my other work!

### Tappy Cloud
- H1: Explore Communities
- H2: Check out some of my other work! · "New tiles on Explore that allows you to meet others with shared interest and dating intents."

### Custom Lists (TV Time)
- H1: Custom Lists · "TV Time is a tracking app for movies and TV." · Research and Analysis · Learning What Users Want · Ideation · Testing and Iterating · Final Designs · Evaluation
- H2: The Problem · Role · Understanding User Pain Points · Confusing Information Architecture · Difficulty Adding Shows to a List* · Existing User Flow · New User Flow · Wireframing

### TV Time Onboarding
- H1: Onboarding · Design Sprint · "TV Time is a tracking app for movies and TV." · Initial Research · Framing the Problem · Ideation · The Solution · Design & Prototype · Testing
- H2: The Problem · Role · Understanding TV Time Users · Mobile App Onboarding · Benefits-Oriented Onboarding · Function-Oriented Onboarding · Progressive Onboarding · Trackers

### About me — new
- TODO — write copy. Likely sections: short bio, what I work on, tools/skills, photo.

### Resume — new
- Single page or modal. Just a styled button/link that triggers download of `resume.pdf` from `/public`.
- TODO — provide the PDF.

## 3. Type system

**Custom font (uploaded by Julia)** — string literals in the Framer bundles
identify it as **Proxima Nova** (Regular, Semibold, Bold; italics in some
weights). 20 `.woff2` files served from `framerusercontent.com/assets/`.

**Framer default fallback** — Inter (full subset family loaded by the
Framer runtime; not necessarily used in the design).

> Action item: confirm Proxima Nova is the only custom face. It is **not**
> free to redistribute — needs an Adobe Fonts (Typekit) license or
> Fontspring license. Two free swap candidates with similar feel: **Mona
> Sans** (GitHub, free) or **Inter Tight**. Or buy/license Proxima Nova on
> typekit.com if you want exact parity.

## 4. Color palette (extracted from JS bundles)

Likely **brand / chrome** (used in shell, footer, headings):
- `#000000` — body text, headings
- `#ffffff` — page background
- `#333333` — secondary text
- `#71757d` — tertiary text / labels
- `#a5a5a5` — disabled / muted
- `rgba(0,0,0,0.08)` — borders, dividers
- `rgba(0,0,0,0.1)` — borders
- `rgba(255,255,255,0.16)` and `rgba(255,255,255,0.8)` — overlays

Likely **project-specific accents** (these match Tinder / Tappy / Festival case studies, not the portfolio's own brand):
- `#fd297c` (Tinder pink)
- `#fa7255` / `#ff7554` (Festival coral)
- `#0099ff` (Tappy blue)
- `#a27fd9` / `rgb(206,187,236)` (Tappy purple)
- `#8495ba` (muted blue-grey)

> Action item: when designing your own brand tokens, treat the black/white/grey
> set as the chrome and pick **one** signature accent that's yours (not a
> client's). The case-study pages should be allowed to override accent tokens
> per-page.

## 5. Assets

### Images (24 unique)
All hosted at `https://framerusercontent.com/images/<hash>.png`:

```
0AL6QuKin6AzW5RIiburJ2PLdBY.png
0h4fuhLQ04LfuSlXrTStJQJNls.png
2D3ol4QegAvogZJUzQmW4R4kwg.png
4HlsBQvdmnDWHJw4NYG9PZqAkw.png
5SlREEj0Jl0Jue2Fit0xc9KGbWo.png
7svHSpCfHlgUb9Dlyr8PxqOyhw.png
82GuH4O5w1woWOm3k5ZjnhsBcA.png
8XJeXTf4Vg06gtotvNGJhkTU4.png
9DbBUbTwXF472EUvodR7Rhckw.png
Bser7IuRQttpgWSnb666dHkFYA.png
G3rA70MnyOwNI2Kmo86cF3k0as.png
KUo4iSzPdyVCSxlQULE8HTFEps.png
Kl79B8Kkoliv6dNPcFhPJ1W3U.png
L51DYrYPrV5xjnRc25LKMs7AfA.png
Lkhr4o06CDfNjFVC6cdq0XfJ8.png
OAndMDfZOvGBhxacSssJOo3revA.png
VpUbA2kxzVImatAD5XNgTWytB7w.png
WDJP7xY87iD5cgYHE2EJwi3zTA.png
XnnFaGgoh0Dq4WAAx1YU2pFEyA.png   ← og:image / hero
aNfI805tNEA6Meu7DEyH6verGUM.png
iXWBOszD45aAHI4B9F8rh5qOPec.png
ktdRSh3KwW5gm0UmWS6fqLtXoOE.png
mrpI2IgquTKKne2hncl4i8Fp7g.png
p37pl1PRTR5va6zsKdlKATJ5A.png
vRibFz5Mn2VakRMjsrc74y57Zr8.png
```

### Video (1)
`https://framerusercontent.com/assets/QoH53nnK61pomMfpBd0vydmNPBA.mp4`

> The case studies almost certainly contain more images and GIFs that load
> only on those routes. A real browser visit is needed to enumerate them.

### Action items
- Download all 24 images at original resolution. Framer serves variants via
  `?scale-down-to=1024&width=…` — strip those params to get the master.
- Walk every case-study page in a real browser; capture additional assets
  and the order they appear.
- Re-export source files where you have them (Figma → 2× PNG, vectors as
  SVG). Framer-served PNGs are bitmap re-exports of your originals.

## 6. Components observed

Inferred from the home/Tappy DOM and headings repeated across pages:

- **Site header / nav** — minimal, sticky, links to Product / Graphic /
  Motion / Contact.
- **Hero with intro copy** (home).
- **Project tile / cell** — large image + title + subtitle + "Read about
  it" CTA. Repeats on home grid and at the bottom of each case study
  ("Check out some of my other work!").
- **Case-study layout** — alternating sections with H1/H2 headings,
  full-bleed media, inline images and GIFs.
- **Footer** — same on every page; contains nav repeats, contact links,
  copyright.

## 7. Effects / interactions

Framer compiles all motion through **Framer Motion** (`motion.D6Unlarn.mjs`,
151 KB). Common patterns visible in the runtime + CSS:

- Sticky elements (`position: sticky` is generated for some containers).
- `will-change: transform` on scroll-driven elements → suggests
  parallax / scroll-linked transforms.
- `cursor: pointer` and `cursor: grab/grabbing` — drag interactions
  somewhere (maybe a gallery carousel).
- Hover variants on cards (the CSS shows `:hover` overrides in
  `framer-v-9z8wtn.hover`).
- Lightbox container (`.framer-lightbox-container`) — image enlargement
  on click.

> A live capture is needed to confirm specifics (which sections parallax,
> hover transitions, durations, easing).

## 8. SEO / meta

- `<title>` per page (some pre-rendered, some default to "My Framer Site").
- `og:image`: the hero PNG `XnnFaGgoh0Dq4WAAx1YU2pFEyA.png`.
- `description`: "I'm a Senior Product Designer with a background in
  visual storytelling, motion, and UX, delivering award-winning
  solutions for mobile and web. Check out what I've been up to!"

## 9. What this audit cannot tell you

The Framer site is a React SPA. Without rendering it in a real browser
the following are unknown:
- Exact text on case-study pages (only headings are in the search index).
- Full asset list per page (only home + Tappy returned a partial pre-render).
- Layout grids, breakpoints, and responsive rules.
- Animation specifics (durations, easings, what triggers what).
- Cursor / hover micro-interactions.

> Next step: open every page in Chrome with DevTools, take full-page
> screenshots at desktop + mobile widths, save the Network tab as HAR,
> and copy the visible body text into per-page Markdown files. That
> closes every gap above.
