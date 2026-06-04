#!/usr/bin/env python3
"""Extract handwritten ink from a scan → cropped transparent PNG for CSS masking."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

INK_RGBA = (0, 0, 0, 255)
# Page band around the scan's text line (300dpi InstaPDF export)
BAND_BOX = (350, 1018, 1950, 1068)
LUM_THRESHOLD = 224
COL_FRAC = 0.15
ROW_FRAC = 0.2
PADDING_PX = 4


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".tmp/handwriting/page-1.png")
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public")
    stem = sys.argv[3] if len(sys.argv) > 3 else "hi-im-julia-hand"

    gray = Image.open(src).convert("L")
    band = gray.crop(BAND_BOX)
    band = ImageOps.autocontrast(band, cutoff=1)
    band = ImageEnhance.Contrast(band).enhance(2.8)

    binary = band.point(lambda p: 0 if p < LUM_THRESHOLD else 255, mode="1")
    rw, rh = binary.size
    px = binary.load()
    cols = [sum(1 for y in range(rh) if px[x, y] == 0) for x in range(rw)]
    rows = [sum(1 for x in range(rw) if px[x, y] == 0) for y in range(rh)]
    mc, mr = max(cols), max(rows)
    xs = [x for x, v in enumerate(cols) if v >= max(2, mc * COL_FRAC)]
    ys = [y for y, v in enumerate(rows) if v >= max(1, mr * ROW_FRAC)]
    if not xs or not ys:
        raise SystemExit("Could not find handwriting bounds.")

    x0 = max(0, xs[0] - PADDING_PX)
    x1 = min(rw, xs[-1] + 1 + PADDING_PX)
    y0 = max(0, ys[0] - PADDING_PX)
    y1 = min(rh, ys[-1] + 1 + PADDING_PX)

    tight = band.crop((x0, y0, x1, y1))
    cw, ch = tight.size
    rgba = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    bin2 = tight.point(lambda p: 0 if p < LUM_THRESHOLD else 255, mode="1")
    bp = bin2.load()
    rp = rgba.load()
    for y in range(ch):
        for x in range(cw):
            if bp[x, y] == 0:
                rp[x, y] = INK_RGBA

    out_dir.mkdir(parents=True, exist_ok=True)
    png_path = out_dir / f"{stem}.png"
    rgba.save(png_path, optimize=True)
    rgba.resize((cw * 2, ch * 2), Image.LANCZOS).save(
        out_dir / f"{stem}@2x.png", optimize=True
    )

    print(f"crop {cw}x{ch}")
    print(png_path)
    print(out_dir / f"{stem}@2x.png")


if __name__ == "__main__":
    main()
