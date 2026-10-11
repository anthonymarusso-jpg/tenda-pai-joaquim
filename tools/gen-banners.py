"""Gera os banners das giras e das festas (1000x440) a partir das imagens de img/.
Uso: python3 tools/gen-banners.py  -> escreve ban/<chave>.jpg e ban/<chave>-f.jpg"""
import math, random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

ROOT = Path(__file__).resolve().parent.parent
W, H = 1000, 440
NAVY = (10, 17, 48)
GOLD = (233, 190, 92)
CORES = {
  'oxala': ['#ffffff', '#e9d9a6'], 'iemanja': ['#6fb6ea', '#ffffff'], 'oxum': ['#f2c12e', '#d4a017'], 'ogum': ['#c8302a', '#1f3f8f'],
  'oxossi': ['#2f8f46', '#7fd1ff'], 'xango': ['#8a5a2b', '#ffffff'], 'iansa': ['#f2c12e', '#e0603a'], 'nana': ['#9a7bc8', '#ffffff'],
  'omulu': ['#111111', '#ffffff', '#c8302a'], 'ibeji': ['#f08cbc', '#6fb6ea'], 'caboclo': ['#2f8f46', '#ffffff'], 'pretovelho': ['#111111', '#ffffff'],
  'boiadeiro': ['#8a5a2b', '#f2c12e'], 'crianca': ['#f08cbc', '#6fb6ea'], 'baiano': ['#f2c12e', '#ffffff'], 'marinheiro': ['#1f63a8', '#ffffff'],
  'cigano': ['#7b3fa0', '#f2c12e', '#c8302a'], 'exu': ['#c8302a', '#111111'], 'pombagira': ['#c8302a', '#111111'], 'malandro': ['#ffffff', '#c8302a']
}
def rgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def tom(k):  # cor de destaque (evita branco/preto puro para o brilho)
    for c in CORES[k]:
        r, g, b = rgb(c)
        if 40 < (r + g + b) / 3 < 235: return (r, g, b)
    return (120, 150, 230)

def cover(img, w, h, fy=.3):
    s = max(w / img.width, h / img.height); im = img.resize((math.ceil(img.width * s), math.ceil(img.height * s)), Image.LANCZOS)
    x = (im.width - w) // 2; y = int((im.height - h) * fy); return im.crop((x, y, x + w, y + h))

def hmask(w, h, a0, a1, x0, x1):
    m = Image.new('L', (w, h)); d = ImageDraw.Draw(m)
    for x in range(w):
        t = 0 if x <= x0 else 1 if x >= x1 else (x - x0) / (x1 - x0)
        d.line([(x, 0), (x, h)], fill=int(a0 + (a1 - a0) * t))
    return m

def glow(size, center, radius, color, alpha):
    g = Image.new('RGBA', size, color + (0,)); d = ImageDraw.Draw(g)
    cx, cy = center; d.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color + (alpha,))
    return g.filter(ImageFilter.GaussianBlur(radius * .45))

def contas(d, pts, cores, r):
    for i, (x, y) in enumerate(pts):
        c = rgb(cores[i % len(cores)])
        d.ellipse([x - r - 1, y - r - 1, x + r + 1, y + r + 1], fill=(0, 0, 0, 90))
        d.ellipse([x - r, y - r, x + r, y + r], fill=c + (235,))
        d.ellipse([x - r * .55, y - r * .6, x - r * .05, y - r * .1], fill=(255, 255, 255, 120))

def curva(p0, p1, sag, n):
    return [(p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t + sag * 4 * t * (1 - t)) for t in [i / (n - 1) for i in range(n)]]

def estrela(d, x, y, r, cor):
    d.polygon([(x, y - r), (x + r * .22, y - r * .22), (x + r, y), (x + r * .22, y + r * .22), (x, y + r), (x - r * .22, y + r * .22), (x - r, y), (x - r * .22, y - r * .22)], fill=cor)

def banner(k, festa):
    rnd = random.Random(hash(k) % 10000 + (7 if festa else 0))
    src = Image.open(ROOT / 'img' / f'{k}.jpg').convert('RGB')
    ac = tom(k)
    # fundo: a própria cena, desfocada, escurecida e tingida
    bg = cover(src, W, H, .35).filter(ImageFilter.GaussianBlur(26))
    bg = ImageEnhance.Brightness(bg).enhance(.55 if not festa else .7)
    tint = Image.new('RGB', (W, H), ac)
    bg = Image.blend(bg, ImageChops.multiply(bg, tint), .35)
    base = bg.convert('RGBA')
    # brilho atrás da figura
    base = Image.alpha_composite(base, glow((W, H), (760, 200), 260, GOLD if festa else ac, 150 if festa else 120))
    # figura nítida à direita, com bordas suaves
    fh = 780; fw = int(src.width * fh / src.height)
    fig = src.resize((fw, fh), Image.LANCZOS).crop((0, 24, fw, 24 + H))
    if festa: fig = ImageEnhance.Brightness(fig).enhance(1.08)
    m = ImageChops.multiply(hmask(fw, H, 0, 255, 0, int(fw * .42)), hmask(fw, H, 255, 0, int(fw * .78), fw))
    vb = Image.new('L', (fw, H), 255); dv = ImageDraw.Draw(vb)
    for y in range(H - 120, H): dv.line([(0, y), (fw, y)], fill=int(255 * (H - y) / 120))
    m = ImageChops.multiply(m, vb)
    fx = W - fw + 70
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); layer.paste(fig, (fx, 0), m)
    base = Image.alpha_composite(base, layer)
    # escurece a esquerda para o texto do app
    sh = Image.new('RGBA', (W, H), NAVY + (0,)); sh.putalpha(hmask(W, H, 215, 0, 0, 620)); base = Image.alpha_composite(base, sh)
    d = ImageDraw.Draw(base, 'RGBA')
    cores = CORES[k]
    if not festa:
        # bokeh suave e uma guia de contas atravessando embaixo
        bk = Image.new('RGBA', (W, H), (0, 0, 0, 0)); db = ImageDraw.Draw(bk)
        for _ in range(22):
            x, y, r = rnd.randint(0, 640), rnd.randint(0, H), rnd.randint(4, 14)
            db.ellipse([x - r, y - r, x + r, y + r], fill=(255, 240, 210, rnd.randint(18, 50)))
        base = Image.alpha_composite(base, bk.filter(ImageFilter.GaussianBlur(3))); d = ImageDraw.Draw(base, 'RGBA')
        contas(d, curva((-30, 380), (1030, 400), 46, 58), cores, 7)
    else:
        # festa: bandeirinhas, confete, brilhos e moldura dourada
        paleta = [rgb(c) for c in cores] + [GOLD, (255, 255, 255)]
        for (p0, p1, sag, n, fl) in [((-20, 6), (660, -4), 48, 17, 30), ((560, -6), (1020, -10), 22, 12, 20)]:
            pts = curva(p0, p1, sag, n)
            d.line(pts, fill=(255, 240, 200, 200), width=2)
            for i in range(n - 1):
                (x0, y0), (x1, y1) = pts[i], pts[i + 1]
                c = paleta[(i + (n % 3)) % len(paleta)]
                mx, my = (x0 + x1) / 2, (y0 + y1) / 2
                d.polygon([(x0 + 3, y0), (x1 - 3, y1), (mx, my + fl)], fill=c + (235,), outline=(0, 0, 0, 60))
        for _ in range(150):
            x, y = rnd.randint(0, W), rnd.randint(50, H)
            if x > 640 and y < 330 and rnd.random() < .8: continue
            c = paleta[rnd.randrange(len(paleta))]
            if rnd.random() < .5:
                a = rnd.random() * math.pi; l = rnd.randint(4, 9); w2 = 2.4
                pts = [(x + math.cos(a) * l - math.sin(a) * w2, y + math.sin(a) * l + math.cos(a) * w2), (x + math.cos(a) * l + math.sin(a) * w2, y + math.sin(a) * l - math.cos(a) * w2),
                       (x - math.cos(a) * l + math.sin(a) * w2, y - math.sin(a) * l - math.cos(a) * w2), (x - math.cos(a) * l - math.sin(a) * w2, y - math.sin(a) * l + math.cos(a) * w2)]
                d.polygon(pts, fill=c + (rnd.randint(150, 230),))
            else:
                r = rnd.randint(2, 4); d.ellipse([x - r, y - r, x + r, y + r], fill=c + (rnd.randint(150, 230),))
        for _ in range(14):
            estrela(d, rnd.randint(40, 640), rnd.randint(70, H - 40), rnd.randint(6, 14), (255, 236, 170, rnd.randint(170, 240)))
        d.rounded_rectangle([8, 8, W - 9, H - 9], radius=26, outline=GOLD + (255,), width=5)
        d.rounded_rectangle([18, 18, W - 19, H - 19], radius=20, outline=(255, 236, 170, 150), width=2)
    # vinheta
    vig = Image.new('L', (W, H), 0); dv = ImageDraw.Draw(vig); dv.rectangle([0, 0, W, H], fill=0)
    vg = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dg = ImageDraw.Draw(vg)
    for i in range(40): dg.rectangle([i, i, W - i, H - i], outline=(0, 0, 0, int(90 * (1 - i / 40) ** 2)))
    base = Image.alpha_composite(base, vg)
    return base.convert('RGB')

if __name__ == '__main__':
    out = ROOT / 'ban'; out.mkdir(exist_ok=True)
    for k in CORES:
        banner(k, False).save(out / f'{k}.jpg', quality=80, optimize=True, progressive=True)
        banner(k, True).save(out / f'{k}-f.jpg', quality=80, optimize=True, progressive=True)
    print('ok', len(list(out.glob('*.jpg'))))
