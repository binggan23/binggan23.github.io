#!/usr/bin/env python3
"""Turn the avatar into a constructivist two-plate print (ink + vermilion)."""
from PIL import Image, ImageEnhance, ImageOps, ImageFilter
import numpy as np

SRC = "/tmp/avatar.png"
OUT_INK = "public/portrait-ink.jpg"
OUT_HALF = "public/portrait-halftone.png"

PAPER = np.array([239, 231, 217], dtype=np.float32)
INK = np.array([22, 19, 15], dtype=np.float32)
RED = np.array([218, 44, 31], dtype=np.float32)

base = Image.open(SRC).convert("L")
# square crop, upscale for crisp print
side = min(base.size)
base = base.crop(((base.width - side) // 2, (base.height - side) // 2, (base.width + side) // 2, (base.height + side) // 2))
base = base.resize((900, 900), Image.LANCZOS)
base = ImageOps.autocontrast(base, cutoff=2)
base = ImageEnhance.Contrast(base).enhance(1.22)
base = ImageEnhance.Brightness(base).enhance(1.04)
base = base.filter(ImageFilter.UnsharpMask(radius=2.2, percent=125, threshold=3))

lum = np.asarray(base, dtype=np.float32) / 255.0

# paper(dark) -> ink ; keep a soft shoulder so paper stays bright
t = np.clip(lum, 0, 1) ** 1.05
rgb = INK[None, None, :] + (PAPER - INK)[None, None, :] * t[..., None]

# vermilion plate: punches the midtones, misregistered by 2px
mid = np.clip((lum - 0.18) / 0.62, 0, 1)
red_mask = (1 - np.abs(mid - 0.45) * 2).clip(0, 1) ** 2.2 * 0.55
red_plate = np.roll(rgb, shift=(-2, 2), axis=(0, 1))
rgb = rgb * (1 - red_mask[..., None]) + (red_plate * 0.35 + RED[None, None, :] * 0.65) * red_mask[..., None]

# faint paper grain
rng = np.random.default_rng(7)
grain = rng.normal(0, 3.2, (900, 900, 1))
rgb = np.clip(rgb + grain, 0, 255).astype(np.uint8)
Image.fromarray(rgb, "RGB").save(OUT_INK, quality=88, optimize=True, progressive=True)

# ——— halftone plate: dots of ink on transparent paper ———
cell = 7
small = base.resize((900 // cell, 900 // cell), Image.LANCZOS)
arr = np.asarray(small, dtype=np.float32) / 255.0
half = Image.new("L", (900, 900), 255)
from PIL import ImageDraw
d = ImageDraw.Draw(half)
max_r = cell * 0.72
for y in range(arr.shape[0]):
    for x in range(arr.shape[1]):
        darkness = 1.0 - arr[y, x]
        r = max_r * (darkness ** 0.72)
        if r < 0.35:
            continue
        cx, cy = x * cell + cell / 2, y * cell + cell / 2
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=0)
halftone = Image.merge("RGBA", (
    Image.new("L", half.size, 22),
    Image.new("L", half.size, 19),
    Image.new("L", half.size, 15),
    ImageOps.invert(half),
))
halftone.save(OUT_HALF, optimize=True)

print("wrote", OUT_INK, OUT_HALF)
