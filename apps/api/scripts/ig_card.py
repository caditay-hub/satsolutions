# -*- coding: utf-8 -*-
# Генератор Instagram-карточки товара SAT Solutions (1080×1350, фирменный стиль сайта).
# Использование: python3 ig_card.py <product.json> <out.png>
# Логотип строится из apps/web/public/logo.png (белая версия кэшируется в /tmp).
import io
import json
import os
import sys
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageOps

DARK = (15, 23, 42)
ACCENT = (37, 99, 235)
ICE = (202, 220, 252)
MUTED = (148, 163, 184)
WHITE = (255, 255, 255)
PRICE = (96, 165, 250)
GREEN = (22, 163, 74)

W, H = 1080, 1350
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

FONT_BOLD = None
FONT_REG = None
for bold, reg in [
    ("arialbd.ttf", "arial.ttf"),
    ("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
     "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"),
    ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
     "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
]:
    try:
        ImageFont.truetype(bold, 10)
        FONT_BOLD, FONT_REG = bold, reg
        break
    except OSError:
        continue


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def fmt_price(p):
    return "от {:,} сум".format(int(float(p))).replace(",", " ")


def wrap(d, text, fnt, max_w, max_lines=3):
    words = text.split()
    lines, cur = [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if d.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w_
    if cur:
        lines.append(cur)
    return lines[:max_lines]


def white_logo():
    """Белая версия логотипа без слогана (кэш в /tmp)."""
    cache = "/tmp/ig-logo-white.png" if os.name != "nt" else os.path.join(os.environ.get("TEMP", "."), "ig-logo-white.png")
    if os.path.exists(cache):
        return Image.open(cache).convert("RGBA")
    for src_path in [
        os.path.join(os.path.dirname(__file__), "..", "..", "web", "public", "logo.png"),
        "/var/www/satweb/apps/web/public/logo.png",
    ]:
        if os.path.exists(src_path):
            break
    src = Image.open(src_path).convert("RGBA")
    w, h = src.size
    px = src.load()
    gap = None
    for y in range(int(h * 0.55), h):
        if all(sum(px[x, y][:3]) >= 600 for x in range(w)):
            gap = y
            break
    crop = src.crop((0, 0, w, gap if gap else h))
    gray = crop.convert("L")
    bbox = gray.point(lambda v: 255 if v < 245 else 0).getbbox()
    crop = crop.crop(bbox)
    gl = crop.convert("L")
    alpha = gl.point(lambda v: max(0, 255 - v))
    out = Image.new("RGBA", crop.size, (255, 255, 255, 0))
    out.putalpha(alpha)
    out.save(cache)
    return out


def make_card(product, out_path):
    img = Image.new("RGB", (W, H), DARK)
    d = ImageDraw.Draw(img)

    # шапка: логотип + сайт
    logo = white_logo()
    lw = 300
    lh = int(logo.height * lw / logo.width)
    logo = logo.resize((lw, lh), Image.LANCZOS)
    img.paste(logo, (60, 56), logo)
    d.text((W - 60 - d.textlength("satsolutions.uz", font=font(30)), 70), "satsolutions.uz", font=font(30), fill=MUTED)

    # фото товара на белой скруглённой плашке
    photo_top, plate_h = 175, 620
    plate = Image.new("RGB", (W - 120, plate_h), WHITE)
    req = urllib.request.Request(product["coverImageUrl"], headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        photo = Image.open(io.BytesIO(r.read())).convert("RGB")
    ph = plate_h - 80
    pw = int(photo.width * ph / photo.height)
    if pw > plate.width - 80:
        pw = plate.width - 80
        ph = int(photo.height * pw / photo.width)
    photo = photo.resize((pw, ph), Image.LANCZOS)
    plate.paste(photo, ((plate.width - pw) // 2, (plate_h - ph) // 2))
    mask = Image.new("L", plate.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, plate.width, plate_h], radius=28, fill=255)
    img.paste(plate, (60, photo_top), mask)

    # бейдж «В наличии»
    btxt = "В НАЛИЧИИ НА СКЛАДЕ"
    bf = font(26, True)
    bw = int(d.textlength(btxt, font=bf)) + 56
    d.rounded_rectangle([60, photo_top + plate_h - 26, 60 + bw, photo_top + plate_h + 30], radius=28, fill=GREEN)
    d.text((88, photo_top + plate_h - 12), btxt, font=bf, fill=WHITE)

    # название
    y = photo_top + plate_h + 64
    name_f = font(46, True)
    for ln in wrap(d, product["name"], name_f, W - 120):
        d.text((60, y), ln, font=name_f, fill=WHITE)
        y += 58

    # цена
    y += 14
    d.text((60, y), fmt_price(product["price"]), font=font(58, True), fill=PRICE)
    y += 86

    # характеристики (до 3 коротких)
    chars = product.get("characteristics") or {}
    cf = font(32)
    for k, v in [(k, v) for k, v in chars.items() if len(str(v)) <= 34][:3]:
        d.ellipse([60, y + 8, 78, y + 26], fill=ACCENT)
        d.text((96, y), "%s: %s" % (k, v), font=cf, fill=ICE)
        y += 52

    # нижняя плашка
    bar_h = 110
    d.rectangle([0, H - bar_h, W, H], fill=ACCENT)
    d.text((60, H - bar_h + 30), "+998 99 554-69-69", font=font(40, True), fill=WHITE)
    cta = "Цена и наличие — в Direct"
    d.text((W - 60 - d.textlength(cta, font=font(34, True)), H - bar_h + 34), cta, font=font(34, True), fill=WHITE)

    img.save(out_path, quality=92)


if __name__ == "__main__":
    product = json.loads(io.open(sys.argv[1], encoding="utf-8").read())
    make_card(product, sys.argv[2])
    print(sys.argv[2])
