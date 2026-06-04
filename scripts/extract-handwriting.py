#!/usr/bin/env python3
"""Extract handwritten ink from a scan into a cropped transparent PNG for CSS masking."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

# Light pencil on office scan: letters sit in a mid-gray band; a dark smear
# row at low thresholds must be excluded by using a luminance window only.
BAND_BOX = (450, 1030, 1980, 1058)
LUM_MIN = 232
LUM_MAX = 238
INK_RGBA = (0, 0, 0, 255)
PADDING_PX = 2


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".tmp/handwriting/page-1.png")
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public")
    stem = sys.argv[3] if len(sys.argv) > 3 else "hi-im-julia-hand"

    gray = Image.open(src).convert("L")
    band = gray.crop(BAND_BOX)
    rw, rh = band.size
    rgba = Image.new("RGBA", (rw, rh), (0, 0, 0, 0))
    rp = rgba.load()

    for y in range(rh):
        for x in range(rw):
            p = band.getpixel((x, y))
            if LUM_MIN <= p <= LUM_MAX:
                rp[x, y] = INK_RGBA

    cols = [sum(1 for y in range(rh) if rp[x, y][3] > 128) for x in range(rw)]
    rows = [sum(1 for x in range(rw) if rp[x, y][3] > 128) for y in range(rh)]
    xs = [x for x, v in enumerate(cols) if v >= 2]
    ys = [y for y, v in enumerate(rows) if v >= 2]
    if not xs or not ys:
        raise SystemExit("No handwriting found; adjust LUM_MIN/LUM_MAX.")

    x0 = max(0, xs[0] - PADDING_PX)
    x1 = min(rw, xs[-1] + 1 + PADDING_PX)
    y0 = max(0, ys[0] - PADDING_PX)
    y1 = min(rh, ys[-1] + 1 + PADDING_PX)
    tight = rgba.crop((x0, y0, x1, y1))
    cw, ch = tight.size

    opaque = sum(1 for y in range(ch) for x in range(cw) if tight.getpixel((x, y))[3] > 128)
    coverage = opaque / (cw * ch)
    row_fill = max(
        sum(1 for x in range(cw) if tight.getpixel((x, y))[3] > 128) for y in range(ch)
    ) / cw
    if coverage > 0.5 or row_fill > 0.75:
        raise SystemExit(
            f"Mask still too solid ({coverage:.0%} opaque, {row_fill:.0%} max row). "
            "Tune LUM_MIN/LUM_MAX or rescan with darker ink."
        )

    out_dir.mkdir(parents=True, exist_ok=True)
    png_path = out_dir / f"{stem}.png"
    tight.save(png_path, optimize=True)
    tight.resize((cw * 2, ch * 2), Image.LANCZOS).save(
        out_dir / f"{stem}@2x.png", optimize=True
    )

    print(f"crop {cw}x{ch}, opaque {coverage:.1%}, max row {row_fill:.1%}")
    print(png_path)


if __name__ == "__main__":
    main()
