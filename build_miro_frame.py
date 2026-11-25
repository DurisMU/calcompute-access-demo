from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 1000
img = Image.new("RGBA", (W, H), (7, 11, 24, 255))
for y in range(H):
    r = int(7 + 10 * (y / H)); g = int(11 + 6 * (y / H)); b = int(24 + 18 * (y / H))
    ImageDraw.Draw(img).line([(0, y), (W, y)], fill=(r, g, b, 255))
for cx, cy, rad, color in [(220, 120, 420, (124, 92, 255)), (1400, 180, 420, (34, 211, 238)), (1200, 900, 380, (255, 107, 107))]:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ld = ImageDraw.Draw(layer)
    for i in range(14, 0, -1):
        rr = rad * i / 14; a = int(28 * (1 - i / 14) ** 1.3)
        ld.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=color + (a,))
    img = Image.alpha_composite(img, layer)
d = ImageDraw.Draw(img)

def font(size, bold=False):
    for p in (["/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf", "/System/Library/Fonts/Helvetica.ttc"]):
        try: return ImageFont.truetype(p, size)
        except Exception: pass
    return ImageFont.load_default()

d.text((50, 42), "CalCompute Access Survey", font=font(38, True), fill=(244, 247, 255))
d.text((50, 92), "A research prototype: from “didn’t find a resource” to a first result", font=font(18), fill=(154, 167, 199))
d.text((50, 124), "Popup → survey → equity access matrix → send result", font=font(14), fill=(34, 211, 238))

def card(path, x, y, w, h, label):
    im = Image.open(path).convert("RGB"); im.thumbnail((w - 16, h - 52)); cw, ch = im.size
    d.rounded_rectangle([x, y, x + w, y + h], radius=16, fill=(16, 23, 43, 235), outline=(120, 145, 210, 90), width=1)
    img.paste(im, (x + (w - cw) // 2, y + 34 + (h - 52 - ch) // 2))
    d.text((x + 18, y + 10), label, font=font(13, True), fill=(210, 220, 245))

card("miro/01-home.png", 40, 180, 500, 690, "01  Popup")
card("miro/03-survey.png", 560, 180, 430, 690, "02  Survey")
card("miro/04-result-matrix.png", 1010, 180, 550, 690, "03  Result + Matrix + Contact")

qr = Image.open("miro/qr-code.png").convert("RGB").resize((150, 150))
img.paste(qr, (1400, 820))
d.text((1230, 830), "Scan to open", font=font(16, True), fill=(244, 247, 255))
d.text((1230, 855), "durismu.github.io/", font=font(13), fill=(154, 167, 199))
d.text((1230, 874), "calcompute-access-demo", font=font(13), fill=(154, 167, 199))
d.text((50, 905), "Research prototype · no live CalCompute service · not a final eligibility decision", font=font(12), fill=(111, 125, 160))
d.text((50, 928), "Universal eligibility does not necessarily translate into equitable access.", font=font(16, True), fill=(255, 176, 32))
img.convert("RGB").save("miro/00-miro-frame.png", quality=95)
print("saved")
