"""Generate abstract cover images for queued/published posts that don't have one yet.

    python scripts/make-covers.py            # create missing covers in src/assets/blog/covers/
    python scripts/make-covers.py --force    # regenerate all covers referenced by queue/ posts

Needs Pillow (pip install pillow). Covers are committed, so CI never runs this.
Each cover: dark gradient tinted by the post's category, flowing lines seeded by the slug,
the category label and the site name. No title text (cards show the title right below).
"""
from __future__ import annotations

import hashlib
import math
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1600, 900
SITE = re.search(r"url: 'https://([^']+)'", (ROOT / "src/data/profile.ts").read_text(encoding="utf-8")).group(1)

# category (TR or EN) -> base hue (0-360)
HUES = {
    "iklim": 160, "climate": 160,
    "çevre": 130, "environment": 130,
    "temeller": 222, "basics": 222,
    "güvenlik": 8, "security": 8,
    "toplum": 275, "society": 275,
    "altyapı": 195, "infrastructure": 195,
    "uygulama": 35, "applications": 35,
    "girişim": 330, "startups": 330,
    "kariyer": 245, "career": 245,
    "istatistik": 290, "statistics": 290,
    "veri": 185, "data": 185,
    "gizlilik": 345, "privacy": 345,
    "yönetişim": 172, "governance": 172,
}
FONT_DIR = Path("C:/Windows/Fonts")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    for name in (["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"] if bold else ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]):
        for base in (FONT_DIR, Path("/usr/share/fonts/truetype/dejavu")):
            if (base / name).exists():
                return ImageFont.truetype(str(base / name), size)
    return ImageFont.load_default()


def hsl(h: float, s: float, l: float, a: int = 255) -> tuple[int, int, int, int]:
    import colorsys
    r, g, b = colorsys.hls_to_rgb((h % 360) / 360, l, s)
    return int(r * 255), int(g * 255), int(b * 255), a


def cover(slug: str, category: str, out: Path, lang: str = "en") -> None:
    seed = int(hashlib.sha1(slug.encode()).hexdigest(), 16)
    rnd = lambda k: ((seed >> (k * 7)) % 1000) / 1000  # deterministic 0..1 values
    key = category.casefold().replace("i̇", "i")
    hue = HUES.get(key, 220) + (rnd(1) - 0.5) * 16

    img = Image.new("RGBA", (W, H), hsl(hue, 0.35, 0.07))
    # diagonal gradient
    grad = Image.new("RGBA", (W, H))
    gd = ImageDraw.Draw(grad)
    for x in range(0, W, 4):
        t = x / W
        gd.rectangle([x, 0, x + 4, H], fill=hsl(hue + t * 14, 0.55, 0.08 + t * 0.10))
    img = Image.alpha_composite(img, grad)

    # soft glows
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gl = ImageDraw.Draw(glow)
    for k in range(3):
        cx, cy, r = W * (0.2 + 0.7 * rnd(2 + k)), H * (0.1 + 0.8 * rnd(5 + k)), 220 + 260 * rnd(8 + k)
        gl.ellipse([cx - r, cy - r, cx + r, cy + r], fill=hsl(hue + 10 * k, 0.8, 0.5, 70))
    img = Image.alpha_composite(img, glow.filter(ImageFilter.GaussianBlur(120)))

    # flowing lines
    lines = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lines)
    freq, phase, amp = 1.2 + 2.2 * rnd(11), rnd(12) * math.tau, 70 + 90 * rnd(13)
    tilt = (rnd(14) - 0.5) * 0.6
    n = 34
    for i in range(n):
        base = H * 0.18 + i * (H * 0.7 / n)
        pts = []
        for x in range(-20, W + 21, 16):
            u = x / W
            y = base + tilt * (x - W / 2) + amp * math.sin(u * freq * math.tau + phase + i * 0.11) * (0.35 + 0.65 * math.sin(u * math.pi))
            pts.append((x, y))
        alpha = int(40 + 120 * (i / n))
        ld.line(pts, fill=hsl(hue + i * 0.6, 0.75, 0.62, alpha), width=2)
    img = Image.alpha_composite(img, lines)

    # dots grid, fading
    dots = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dots)
    for gx in range(60, W, 40):
        for gy in range(60, H, 40):
            a = int(28 * max(0.0, 1 - math.hypot(gx - W * 0.85, gy - H * 0.2) / 700))
            if a:
                dd.ellipse([gx - 1.5, gy - 1.5, gx + 1.5, gy + 1.5], fill=(255, 255, 255, a))
    img = Image.alpha_composite(img, dots)

    # labels (drawn on their own layer so transparency blends)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f_cat, f_site = font(40, bold=True), font(32)
    label = category.replace("i", "İ").replace("ı", "I").upper() if lang == "tr" else category.upper()
    tw = d.textlength(label, font=f_cat)
    d.rounded_rectangle([80, 80, 80 + tw + 56, 80 + 72], radius=36, fill=(255, 255, 255, 34), outline=(255, 255, 255, 70), width=2)
    d.text((80 + 28, 80 + 36), label, font=f_cat, fill=(255, 255, 255, 235), anchor="lm")
    d.text((80, H - 80), SITE, font=f_site, fill=(255, 255, 255, 190), anchor="ls")
    d.rounded_rectangle([W - 80 - 90, H - 80 - 8, W - 80, H - 80], radius=4, fill=hsl(hue, 0.8, 0.6))
    img = Image.alpha_composite(img, layer)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(out, quality=86, optimize=True, progressive=True)


def main() -> None:
    force = "--force" in sys.argv
    covers = ROOT / "src/assets/blog/covers"
    made = 0
    for folder in (ROOT / "queue", ROOT / "src/content/blog"):
        for md in folder.glob("*/*.md"):
            text = md.read_text(encoding="utf-8")
            src = re.search(r'^\s+src:\s*"([^"]*covers/[^"]+)"', text, re.M)
            if not src:
                continue
            target = covers / Path(src.group(1)).name
            if target.exists() and not (force and folder.name == "queue"):
                continue
            cat = (re.search(r'^category:\s*"([^"]+)"', text, re.M) or [None, "Blog"])[1]
            cover(md.stem, cat, target, md.parent.name)
            made += 1
            print("cover", target.name, "·", cat)
    print(made, "covers written")


if __name__ == "__main__":
    main()
