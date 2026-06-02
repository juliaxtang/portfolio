# Deck build resources

Everything you need to set up a Figma Slides file that matches your portfolio brand. Pulled from `src/styles/tokens.css` — single source of truth.

## Fonts (download links)

All three fonts are free and ship via Google Fonts or Vercel.

### Instrument Serif — display font (headlines, stats, large statements)
- Google Fonts: https://fonts.google.com/specimen/Instrument+Serif
- Click "Get font" → download the family → install both Regular and Italic
- **Figma:** once installed locally, Figma picks it up automatically. To use Figma's web version, add it from the type panel and Figma will fetch it.

### Geist — sans-serif (body, captions, UI)
- Vercel Fonts: https://vercel.com/font (download the Geist family)
- Or Google Fonts: https://fonts.google.com/specimen/Geist
- Install at least Regular, Medium, Semibold.

### Geist Mono — monospace (captions, technical labels)
- Vercel Fonts: https://vercel.com/font (Geist Mono variant)
- Or Google Fonts: https://fonts.google.com/specimen/Geist+Mono

## Colors (paste into Figma styles)

Copy-paste into Figma Local Styles. Use these as fills, and **publish them as a library** before building slides so Smart Animate naming stays consistent.

### Brand (fixed across modes)
| Name | Hex | Usage |
|---|---|---|
| `brand/primary` | `#C5DCEA` | Powder blue — primary accent |
| `brand/primary-2` | `#A9C7DC` | Pressed / hover state |
| `brand/secondary` | `#F4D9CC` | Warm peach — secondary accent |
| `brand/secondary-2` | `#E9C2B0` | |
| `brand/accent` | `#DCD2E8` | Lavender mist — tertiary accent |

### Light surface
| Name | Hex | Usage |
|---|---|---|
| `bg/canvas` | `#FDFCFA` | **Default slide background** |
| `bg/surface` | `#FFFFFF` | Cards, elevated surfaces |
| `bg/sunken` | `#EFF5FA` | Sunken regions, cool tint |
| `bg/sunken-warm` | `#F4F0EA` | Sunken regions, warm tint |

### Dark surface (for reframe statement slides)
| Name | Hex | Usage |
|---|---|---|
| `bg/canvas-dark` | `#0C0D11` | Dark slide background |
| `bg/surface-dark` | `#15171C` | Elevated on dark |

### Text
| Name | Hex | Usage |
|---|---|---|
| `text/primary` | `#15171C` | Headlines, body |
| `text/secondary` | `#5A5D66` | Subhead, secondary copy |
| `text/tertiary` | `#8B8E96` | Captions, metadata |
| `text/inverse` | `#FDFCFA` | Text on dark surfaces |

### Borders
| Name | Hex | Usage |
|---|---|---|
| `border/subtle` | `#EAE6DF` | Hairline dividers |
| `border/default` | `#D8D3CB` | Card borders |

## Gradients

Three SVG files in this folder, drag straight into Figma:

- `gradient-brand.svg` — saturated 3-stop linear (powder blue → lavender → peach). For hero / cover slides.
- `gradient-soft.svg` — softer 3-stop linear. For section dividers.
- `gradient-aurora.svg` — multi-radial cream base with three soft blooms. For framing slide / case study covers — matches the Hero treatment on your portfolio.

**If you need raster PNGs** (some tools won't import SVG cleanly): open `gradients-preview.html` in Chrome, right-click each panel → "Save image as." Renders at 1920×1080 native.

## Icons

Your portfolio doesn't have a published icon library — the components inline their SVGs. For the deck, install:

### Lucide (recommended)
- Site: https://lucide.dev
- Figma plugin: search "Lucide Icons" in Figma plugins, install
- Why: 1400+ icons, minimal stroke, free, MIT licensed, has a Figma plugin that drops icons as components. Matches your sparse aesthetic.

### Alternative: Phosphor
- Site: https://phosphoricons.com
- Figma plugin: "Phosphor Icons"
- Similar quality, slightly more rounded if you want a softer feel.

**For this deck specifically you barely need icons** — sparse style means mostly type + images. Likely uses: chevron/arrow for "next steps" slide, checkmark for tradeoff comparisons, occasional UI glyphs (bell for notifications, etc.). 5–10 icons total across both decks.

## Type scale for the deck

Based on `tokens.css` + slide-friendly upscaling. Set these as Figma text styles:

| Name | Font | Size | Line height | Use |
|---|---|---|---|---|
| `slide/display-xl` | Instrument Serif | 180px | 0.95 | Hero stat numbers (+32K) |
| `slide/display-l` | Instrument Serif | 96px | 1.05 | Section titles, reframe statements |
| `slide/display-m` | Instrument Serif | 64px | 1.1 | Slide headlines |
| `slide/headline` | Geist Semibold | 48px | 1.2 | Default slide title |
| `slide/subhead` | Geist Medium | 28px | 1.3 | Slide subtitle / context |
| `slide/body` | Geist Regular | 22px | 1.45 | Talk-track callouts (rare on slide) |
| `slide/caption` | Geist Mono Regular | 16px | 1.4 | Captions, footnotes, attribution |

Slide dimensions: **1920×1080** (Figma Slides default, 16:9).

## Library setup checklist (do this first)

1. Create a new Figma library file called **"Julia / Portfolio Deck System"**.
2. Add the 7 text styles above.
3. Add all colors as local styles.
4. Drag the three gradient SVGs in as components.
5. Build the 6 slide templates from [`slide-templates.md`](./slide-templates.md), each as a component named `Slide / Template / [Type]`.
6. **Publish the library.**
7. Open your interview deck file → Assets panel → enable the library.
8. Now everything is linked. Build slides by duplicating templates.

Time on setup: ~45 min. Pays itself back inside the first 5 slides.
