'use strict';
/* Orixás e linhas da Umbanda: fichas e medalhões ilustrados (desenho próprio, em SVG).
   Conteúdo segue a tradição mais comum; cada casa tem seus fundamentos. */
(() => {
const GOLD = '#f7d77e', W = '#ffffff';
const P = (d, o = {}) => `<path d="${d}" fill="${o.fill || 'none'}" stroke="${o.stroke || GOLD}" stroke-width="${o.w || 4}" stroke-linecap="round" stroke-linejoin="round"${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
const C = (cx, cy, r, o = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill || 'none'}" stroke="${o.stroke || GOLD}" stroke-width="${o.w != null ? o.w : 4}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
const E = (cx, cy, rx, ry, o = {}) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${o.fill || 'none'}" stroke="${o.stroke || GOLD}" stroke-width="${o.w != null ? o.w : 4}"${o.op != null ? ` opacity="${o.op}"` : ''}${o.rot ? ` transform="rotate(${o.rot} ${cx} ${cy})"` : ''}/>`;
const rep = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');

/* ---- cenários (atrás do símbolo) ---- */
const S = {
  raios: (c = W, op = .22) => rep(16, i => { const a = i * Math.PI / 8; return P(`M${100 + Math.cos(a) * 30} ${100 + Math.sin(a) * 30}L${100 + Math.cos(a) * 80} ${100 + Math.sin(a) * 80}`, { stroke: c, w: 3, op }); }),
  ondas: (y0 = 136, c = W, op = .38) => [0, 14, 28].map(k => P(`M10 ${y0 + k}q12-9 24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0`, { stroke: c, w: 3, op: op - k / 100 })).join(''),
  cachoeira: () => rep(9, i => P(`M${44 + i * 14} 20 C${40 + i * 14} 60 ${48 + i * 14} 90 ${44 + i * 14} 150`, { stroke: W, w: 2.5, op: .22 })) + E(100, 160, 70, 12, { stroke: W, w: 2.5, op: .3 }),
  folhas: (c = '#0f4d22', op = .9) => [[34, 70, -30], [30, 112, 20], [44, 150, 50], [166, 70, 30], [170, 112, -20], [156, 150, -50], [60, 40, -60], [140, 40, 60]].map(([x, y, r]) => E(x, y, 22, 9, { fill: c, stroke: '#7bd08f', w: 1.5, op, rot: r })).join(''),
  pedras: () => [[40, 160, 30, 16], [92, 170, 34, 16], [150, 160, 32, 18], [120, 150, 18, 10], [66, 150, 16, 9]].map(([x, y, rx, ry]) => E(x, y, rx, ry, { fill: '#3a2410', stroke: '#c9a26a', w: 2 })).join(''),
  vento: () => P('M30 60c20-14 50-10 50 6s-24 14-24 2', { stroke: W, w: 3, op: .35 }) + P('M120 150c20 12 52 6 50-10s-24-12-22 2', { stroke: W, w: 3, op: .35 }) + P('M28 120c18-8 36-6 44 4', { stroke: W, w: 3, op: .3 }) + P('M150 46l-14 26h12l-12 24', { stroke: '#fff3b0', w: 3, op: .55 }),
  lama: () => [0, 1, 2, 3].map(k => E(100, 160, 30 + k * 18, 6 + k * 3, { stroke: '#e3d4ff', w: 2, op: .35 - k * .06 })).join(''),
  palha: () => rep(26, i => P(`M${18 + i * 6.4} 22 L${16 + i * 6.4 + (i % 3)} ${70 + (i % 4) * 8}`, { stroke: '#d9c27a', w: 2.4, op: .55 })),
  confete: () => [[40, 50, '#ffe066'], [160, 56, '#ffffff'], [52, 150, '#7fd1ff'], [150, 146, '#ffe066'], [36, 100, '#ff9ccc'], [166, 104, '#b2f2bb'], [100, 30, '#ffffff'], [128, 168, '#ff9ccc']].map(([x, y, c]) => C(x, y, 4, { fill: c, stroke: 'none', w: 0 })).join(''),
  fumaca: () => P('M60 60c-10-10 6-18-2-28', { stroke: W, w: 2.5, op: .3 }) + P('M146 54c10-10-6-18 2-28', { stroke: W, w: 2.5, op: .3 }),
  sertao: () => P('M10 150 L50 132 L80 144 L120 128 L160 142 L190 130', { stroke: '#f2c98a', w: 2.5, op: .45 }) + C(150, 60, 14, { stroke: '#ffd98a', w: 2.5, op: .5 }),
  coqueiral: () => P('M10 160 q45-12 90 0 t90 0', { stroke: '#ffe9a8', w: 2.5, op: .45 }) + C(56, 54, 12, { stroke: '#fff3b0', w: 2.5, op: .45 }),
  estrelas: () => [[42, 52], [156, 46], [36, 132], [164, 136], [100, 26]].map(([x, y]) => P(`M${x} ${y - 6}L${x + 1.6} ${y - 1.6}L${x + 6} ${y}L${x + 1.6} ${y + 1.6}L${x} ${y + 6}L${x - 1.6} ${y + 1.6}L${x - 6} ${y}L${x - 1.6} ${y - 1.6}Z`, { fill: '#ffe9a8', stroke: 'none', w: 0, op: .7 })).join(''),
  encruzilhada: () => P('M24 24 L176 176 M176 24 L24 176', { stroke: '#ff8a7a', w: 3, op: .28 }) + C(100, 100, 60, { stroke: '#ff8a7a', w: 2, op: .22 }),
  lapa: () => rep(5, i => P(`M${18 + i * 34} 176 V150 a17 17 0 0 1 34 0 V176`, { stroke: W, w: 2.2, op: .28 }))
};

/* ---- símbolos (ferramentas) ---- */
const Y = {
  oxala: () => P('M100 64 V166') + E(100, 84, 16, 4.5) + E(100, 100, 25, 6) + rep(7, i => P(`M${78 + i * 7.3} 104 v8`, { w: 2.5 })) + C(100, 166, 4, { fill: GOLD })
    + P('M80 50 Q90 36 100 50 Q110 36 120 50', { stroke: W, w: 4 }) + E(100, 54, 6, 4, { fill: W, stroke: W, w: 1 }),
  iemanja: () => C(100, 84, 28) + C(100, 84, 20, { w: 2, op: .7 }) + P('M100 66 L104 80 L118 84 L104 88 L100 102 L96 88 L82 84 L96 80 Z', { fill: '#dff2ff', stroke: GOLD, w: 2 })
    + rep(12, i => { const a = i * Math.PI / 6; return C(100 + Math.cos(a) * 33, 84 + Math.sin(a) * 33, 2.6, { fill: W, stroke: 'none', w: 0 }); }) + P('M100 112 V158') + E(100, 136, 6, 3),
  oxum: () => C(100, 84, 26) + C(100, 84, 15, { fill: 'rgba(255,240,180,.55)', w: 2.5 }) + rep(16, i => { const a = i * Math.PI / 8; return P(`M${100 + Math.cos(a) * 30} ${84 + Math.sin(a) * 30}L${100 + Math.cos(a) * 36} ${84 + Math.sin(a) * 36}`, { w: 2.5 }); })
    + P('M93 80 q7-9 14 0 q-3 6-7 9 q-4-3-7-9z', { fill: '#ffd166', stroke: 'none', w: 0 }) + P('M100 110 V160') + E(100, 140, 6, 3),
  ogum: () => P('M58 154 L128 66 L140 50 L134 70 L64 158 Z', { fill: 'rgba(255,248,220,.9)', w: 2.5 }) + P('M68 128 L88 146', { w: 5 }) + C(55, 160, 5, { fill: GOLD })
    + P('M144 156 L78 70', { w: 4 }) + P('M70 50 L86 70 L66 76 Z', { fill: GOLD, w: 3 }),
  oxossi: () => P('M70 56 Q138 100 70 144', { w: 5 }) + P('M70 56 L70 144', { w: 2, stroke: W }) + P('M54 100 L146 100', { w: 4 }) + P('M146 100 L132 92 M146 100 L132 108', { w: 4 })
    + P('M60 100 l-8-8 M60 100 l-8 8 M66 100 l-8-8 M66 100 l-8 8', { w: 2.5, stroke: '#b2f2bb' }),
  xango: () => P('M100 62 V166', { w: 5 }) + P('M97 72 C80 64 64 70 60 88 C64 104 80 110 97 102 Z', { fill: 'rgba(247,215,126,.35)', w: 3.5 }) + P('M103 72 C120 64 136 70 140 88 C136 104 120 110 103 102 Z', { fill: 'rgba(247,215,126,.35)', w: 3.5 })
    + P('M90 58 l4-10 6 7 6-7 4 10 Z', { fill: GOLD, w: 2 }) + C(100, 166, 5, { fill: GOLD }) + rep(3, i => C(100, 120 + i * 12, 3, { fill: W, stroke: 'none', w: 0 })),
  iansa: () => P('M56 150 C70 120 92 84 128 52', { w: 5 }) + P('M58 136 l16 10', { w: 4 }) + P('M128 52 l8-6', { w: 4 })
    + P('M142 156 L118 104', { w: 4 }) + rep(9, i => P(`M118 104 Q${100 + i * 5} ${76 - (i % 3) * 4} ${92 + i * 6} ${56 + (i % 2) * 6}`, { stroke: '#fff3c4', w: 2 })),
  nana: () => P('M86 160 C70 112 72 74 104 58 C126 48 140 64 128 80', { w: 9, stroke: '#d9c27a' }) + P('M86 160 C70 112 72 74 104 58 C126 48 140 64 128 80', { w: 3 })
    + [[80, 130], [76, 104], [86, 80], [110, 62]].map(([x, y]) => E(x, y, 9, 3.5, { fill: '#9a7bc8', stroke: GOLD, w: 2, rot: 30 })).join('') + rep(5, i => E(96 + i * 5, 150 - i * 6, 2.6, 4, { fill: W, stroke: 'none', w: 0 })),
  omulu: () => rep(15, i => P(`M100 82 L${68 + i * 4.6} 156`, { stroke: '#e8d18c', w: 2.4 })) + E(100, 86, 12, 5, { fill: '#c8302a', w: 2.5 }) + P('M94 82 C92 64 108 64 106 82', { w: 3 })
    + [[82, 128], [100, 136], [118, 128], [90, 148], [110, 148]].map(([x, y]) => E(x, y, 3, 4.5, { fill: W, stroke: '#222', w: 1 })).join(''),
  ibeji: () => [82, 118].map(x => C(x, 76, 11, { fill: '#fff4fa', w: 3 }) + P(`M${x - 13} 128 L${x - 9} 92 H${x + 9} L${x + 13} 128 Z`, { fill: x < 100 ? '#ff9ccc' : '#7fd1ff', w: 3 })).join('')
    + P('M91 104 Q100 112 109 104', { w: 3 }) + P('M70 150 h60', { w: 2.5, op: .6 }) + C(140, 60, 8, { fill: '#ffe066', w: 2.5 }) + P('M140 68 V96', { w: 2.5 }),
  caboclo: () => rep(9, i => { const a = Math.PI + (i + .5) * Math.PI / 9; const x = 100 + Math.cos(a) * 46, y = 118 + Math.sin(a) * 46; return E((100 + x) / 2 + Math.cos(a) * 6, (118 + y) / 2 + Math.sin(a) * 6, 25, 6.5, { fill: ['#f7d77e', '#2f8f46', '#c8302a'][i % 3], stroke: '#3a2a08', w: 1.5, rot: a * 180 / Math.PI }); })
    + P('M58 120 Q100 106 142 120', { w: 6, stroke: '#c8302a' }) + P('M58 120 Q100 106 142 120', { w: 2 }) + P('M48 150 L152 150 M152 150 l-12-7 M152 150 l-12 7', { w: 3.5 }),
  pretovelho: () => P('M64 104 L114 118', { w: 6, stroke: '#7a4a24' }) + P('M110 108 h26 v22 a13 13 0 0 1-26 0 Z', { fill: '#7a4a24', w: 3 }) + P('M120 98 c-8-8 6-14-2-24 M130 96 c6-8-6-14 2-22', { stroke: W, w: 2.5, op: .8 })
    + rep(14, i => { const a = Math.PI * .15 + i * Math.PI * .7 / 13; return C(100 + Math.cos(a) * 46, 120 + Math.sin(a) * 30, 3.2, { fill: W, stroke: 'none', w: 0 }); }) + P('M100 150 V166 M94 158 H106', { stroke: W, w: 3 }),
  boiadeiro: () => E(100, 98, 52, 14, { fill: '#8a5a2b' }) + P('M74 96 C74 64 126 64 126 96', { fill: '#a0703a' }) + P('M76 88 Q100 94 124 88', { stroke: '#f2c98a', w: 3 })
    + C(100, 140, 22, { stroke: '#f2c98a', w: 3.5 }) + P('M122 140 C140 140 150 156 166 150', { stroke: '#f2c98a', w: 3.5 }),
  crianca: () => P('M86 90 V166', { w: 3.5 }) + [0, 90, 180, 270].map(r => `<g transform="rotate(${r} 86 90)">${P('M86 90 C86 70 100 62 108 66 Q98 80 86 90 Z', { fill: ['#ff9ccc', '#7fd1ff', '#ffe066', '#b2f2bb'][r / 90], w: 2.5 })}</g>`).join('') + C(86, 90, 3, { fill: GOLD })
    + C(134, 92, 16, { fill: '#fff', w: 3 }) + P('M134 92 m0-10 a10 10 0 1 1-9 6 a6 6 0 1 1 10 2', { stroke: '#ff6fa8', w: 2.5 }) + P('M134 108 V160', { w: 3 }),
  baiano: () => P('M96 166 C96 130 100 100 108 76', { w: 6, stroke: '#a0703a' }) + [[-70, 36], [-30, 40], [10, 38], [50, 34], [200, 36]].map(([a, l]) => { const r = a * Math.PI / 180; return P(`M108 74 Q${108 + Math.cos(r) * l * .6} ${74 + Math.sin(r) * l * .6 - 14} ${108 + Math.cos(r) * l} ${74 + Math.sin(r) * l}`, { stroke: '#7bd08f', w: 5 }); }).join('')
    + C(102, 84, 6, { fill: '#7a4a24', w: 2 }) + C(114, 86, 6, { fill: '#7a4a24', w: 2 }) + E(140, 152, 18, 6, { fill: '#e9c46a', w: 2.5 }) + P('M128 150 Q140 134 152 150', { fill: '#e9c46a', w: 2.5 }),
  marinheiro: () => C(100, 104, 44, { stroke: W, w: 3, op: .35 }) + rep(8, i => { const a = i * Math.PI / 4; return P(`M${100 + Math.cos(a) * 44} ${104 + Math.sin(a) * 44} L${100 + Math.cos(a) * 56} ${104 + Math.sin(a) * 56}`, { stroke: W, w: 4, op: .35 }); })
    + C(100, 58, 8) + P('M100 66 V150', { w: 5 }) + P('M80 80 H120', { w: 5 }) + P('M68 128 C70 150 90 156 100 152 C110 156 130 150 132 128', { w: 5 }) + P('M64 134 l4-10 8 6 M136 134 l-4-10-8 6', { w: 4 }),
  cigano: () => C(100, 92, 30, { fill: 'rgba(255,255,255,.12)' }) + rep(10, i => { const a = i * Math.PI / 5; return C(100 + Math.cos(a) * 30, 92 + Math.sin(a) * 30, 4.2, { fill: '#ffe9a8', stroke: '#8a5a00', w: 1.2 }); })
    + ['#c8302a', '#2f8f46', '#1f63a8', '#f2c12e', '#9a7bc8'].map((c, i) => P(`M${88 + i * 6} 122 C${80 + i * 8} 140 ${96 + i * 6} 150 ${86 + i * 8} 172`, { stroke: c, w: 3.5 })).join('')
    + P('M100 80 L103 89 L112 89 L105 95 L108 104 L100 98 L92 104 L95 95 L88 89 L97 89 Z', { fill: GOLD, stroke: 'none', w: 0 }),
  exu: () => P('M100 70 V166', { w: 5 }) + P('M76 58 C76 84 124 84 124 58', { w: 5 }) + P('M100 50 V80', { w: 5 }) + P('M76 58 l-5 8 M76 58 l6 6 M124 58 l5 8 M124 58 l-6 6 M100 50 l-6 8 M100 50 l6 8', { w: 4 })
    + C(100, 166, 4, { fill: GOLD }),
  pombagira: () => P('M100 96 C98 130 104 150 98 172', { stroke: '#7bd08f', w: 4 }) + E(84, 140, 12, 5, { fill: '#2f8f46', stroke: '#7bd08f', w: 2, rot: -30 }) + E(114, 152, 12, 5, { fill: '#2f8f46', stroke: '#7bd08f', w: 2, rot: 30 })
    + C(100, 80, 24, { fill: '#b3132a', w: 2.5 }) + P('M100 80 m-4 0 a4 4 0 1 1 8 0 a8 8 0 1 1-14 4 a12 12 0 1 1 22 4 a16 16 0 1 1-28 4', { stroke: '#ffb3b3', w: 2.2 }),
  malandro: () => E(98, 84, 48, 12, { fill: '#ffffff', w: 3 }) + P('M70 82 C70 52 126 52 126 82', { fill: '#ffffff', w: 3 }) + P('M71 74 Q98 80 125 74 L125 82 Q98 88 71 82 Z', { fill: '#c8302a', stroke: 'none', w: 0 })
    + P('M78 168 L130 104', { w: 5 }) + P('M130 104 C136 96 150 100 146 110', { w: 5 })
};

/* cores da guia (contas), fundo do medalhão, cenário */
const ART = {
  oxala: { bg: ['#fbf6e8', '#b9b2a0'], contas: ['#ffffff'], cena: () => S.raios('#fff', .5), dark: true },
  iemanja: { bg: ['#7cc0ee', '#123f7a'], contas: ['#6fb6ea', '#ffffff'], cena: () => S.estrelas() + S.ondas() },
  oxum: { bg: ['#ffd96a', '#a8740a'], contas: ['#f2c12e', '#d4a017'], cena: () => S.cachoeira() },
  ogum: { bg: ['#d0463d', '#1c2f7a'], contas: ['#c8302a', '#1f3f8f'], cena: () => P('M100 190 L100 120 M20 120 L180 120', { stroke: '#fff', w: 2, op: .18 }) + rep(17, i => P(`M${30 + i * 8.6} 158 l${(i % 2 ? 2 : -2)} 22`, { stroke: '#b9d36b', w: 3, op: .9 })) },
  oxossi: { bg: ['#3fae5a', '#0e4a22'], contas: ['#2f8f46', '#7fd1ff'], cena: () => S.folhas() },
  xango: { bg: ['#a06a35', '#3b2210'], contas: ['#8a5a2b', '#ffffff', '#c8302a'], cena: () => S.pedras() + P('M150 34 l-12 22 h10 l-10 20', { stroke: '#fff3b0', w: 3, op: .6 }) },
  iansa: { bg: ['#f5b24a', '#b8401f'], contas: ['#f2c12e', '#e0603a'], cena: () => S.vento() },
  nana: { bg: ['#a98ad6', '#3d2a66'], contas: ['#9a7bc8', '#ffffff'], cena: () => S.lama() },
  omulu: { bg: ['#3a3a3a', '#0b0b0b'], contas: ['#111111', '#ffffff', '#c8302a'], cena: () => S.palha() },
  ibeji: { bg: ['#ffb8d6', '#5da9e0'], contas: ['#f08cbc', '#6fb6ea', '#ffe066'], cena: () => S.confete() },
  caboclo: { bg: ['#4fbf6a', '#0d3f1c'], contas: ['#2f8f46', '#ffffff'], cena: () => S.folhas('#0a3a18', .8) },
  pretovelho: { bg: ['#4a4a4a', '#121212'], contas: ['#111111', '#ffffff'], cena: () => S.fumaca() },
  boiadeiro: { bg: ['#c08a4a', '#4a2c12'], contas: ['#8a5a2b', '#e9c46a'], cena: () => S.sertao() },
  crianca: { bg: ['#ffc6de', '#7cc0ee'], contas: ['#f08cbc', '#6fb6ea'], cena: () => S.confete() },
  baiano: { bg: ['#ffd96a', '#b8860b'], contas: ['#f2c12e', '#ffffff'], cena: () => S.coqueiral() },
  marinheiro: { bg: ['#3a7fc8', '#0a2448'], contas: ['#1f63a8', '#ffffff'], cena: () => S.ondas(148) },
  cigano: { bg: ['#8e4cb8', '#4a0f2a'], contas: ['#7b3fa0', '#f2c12e', '#c8302a'], cena: () => S.estrelas() },
  exu: { bg: ['#c8302a', '#140404'], contas: ['#c8302a', '#111111'], cena: () => S.encruzilhada() },
  pombagira: { bg: ['#d13a4a', '#2a0610'], contas: ['#c8302a', '#111111'], cena: () => S.estrelas() },
  malandro: { bg: ['#2a2a5a', '#0b0b1e'], contas: ['#ffffff', '#c8302a'], cena: () => S.lapa() + S.estrelas() }
};

let seq = 0;
function medalhao(key, size) {
  const a = ART[key]; if (!a) return '';
  const id = key + (++seq);
  const n = 30, cs = a.contas;
  const beads = rep(n, i => { const t = i / n * Math.PI * 2 - Math.PI / 2; const c = cs[i % cs.length]; return `<circle cx="${(100 + Math.cos(t) * 88).toFixed(1)}" cy="${(100 + Math.sin(t) * 88).toFixed(1)}" r="6.6" fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1"/><circle cx="${(100 + Math.cos(t) * 88 - 2).toFixed(1)}" cy="${(100 + Math.sin(t) * 88 - 2).toFixed(1)}" r="1.8" fill="#fff" opacity=".55"/>`; });
  return `<svg class="med" viewBox="0 0 200 200" width="${size || 200}" height="${size || 200}" role="img" aria-hidden="true">
<defs><radialGradient id="g${id}" cx="50%" cy="34%" r="72%"><stop offset="0" stop-color="${a.bg[0]}"/><stop offset="1" stop-color="${a.bg[1]}"/></radialGradient>
<clipPath id="c${id}"><circle cx="100" cy="100" r="76"/></clipPath>
<filter id="f${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="${a.dark ? .35 : .5}"/></filter></defs>
<circle cx="100" cy="100" r="98" fill="#0d1f5c"/>
<circle cx="100" cy="100" r="88" fill="none" stroke="#c9b27a" stroke-width="1.2" opacity=".8"/>
${beads}
<circle cx="100" cy="100" r="77" fill="url(#g${id})" stroke="${GOLD}" stroke-width="2.5"/>
<g clip-path="url(#c${id})">${a.cena()}</g>
<g filter="url(#f${id})">${a.dark ? Y[key]().replaceAll(GOLD, '#b8892b') : Y[key]()}</g>
</svg>`;
}

const ORIXAS = [
  { k: 'oxala', n: 'Oxalá', s: 'Epa Babá!', dia: 'Sexta-feira', cor: 'Branco', cores: ['#ffffff'], elem: 'Ar', reg: 'A fé, a paz, a criação e a sabedoria. É o pai maior, o orixá que sustenta toda a criação.',
    comidas: ['Canjica branca (ebô)', 'Arroz branco sem sal', 'Inhame cozido', 'Frutas brancas: pera, uva verde e coco', 'Água pura'],
    ervas: ['Boldo (tapete-de-oxalá)', 'Manjericão branco', 'Alfazema', 'Saião', 'Folha de algodão', 'Colônia'],
    ferr: 'Paxorô (cajado de metal branco) e pomba branca', sinc: 'Jesus Cristo, Senhor do Bonfim', festa: '25 de dezembro' },
  { k: 'iemanja', n: 'Iemanjá', s: 'Odoyá!', dia: 'Sábado', cor: 'Azul-claro, branco e prata', cores: ['#6fb6ea', '#ffffff'], elem: 'Água salgada', reg: 'O mar, a maternidade, a família e a cabeça (ori) de seus filhos. Rainha das águas salgadas.',
    comidas: ['Manjar branco', 'Arroz-doce', 'Peixe assado', 'Canjica com leite de coco', 'Melão e uvas brancas', 'Champanhe'],
    ervas: ['Colônia', 'Alfazema', 'Pata-de-vaca', 'Rosa branca', 'Lágrima-de-nossa-senhora', 'Jasmim'],
    ferr: 'Abebé prateado (leque com espelho), conchas e estrela-do-mar', sinc: 'Nossa Senhora dos Navegantes e da Conceição', festa: '2 de fevereiro e 8 de dezembro' },
  { k: 'oxum', n: 'Oxum', s: 'Ora yê yê ô!', dia: 'Sábado', cor: 'Amarelo e dourado', cores: ['#f2c12e', '#d4a017'], elem: 'Água doce', reg: 'Os rios, as cachoeiras, o amor, a fertilidade, a gestação e a prosperidade.',
    comidas: ['Omolocum (feijão-fradinho com ovos e azeite doce)', 'Quindim', 'Mel', 'Canjica amarela', 'Frutas doces: pêssego, mamão e pera', 'Champanhe'],
    ervas: ['Camomila', 'Erva-cidreira', 'Malva-rosa', 'Oriri (alfavaquinha)', 'Colônia', 'Rosa amarela'],
    ferr: 'Abebé dourado (espelho), joias e leque', sinc: 'Nossa Senhora Aparecida e da Conceição', festa: '12 de outubro e 8 de dezembro' },
  { k: 'ogum', n: 'Ogum', s: 'Ogunhê!', s2: 'Patacori, Ogum!', dia: 'Terça-feira', cor: 'Vermelho e azul-escuro', cores: ['#c8302a', '#1f3f8f'], elem: 'Ferro e terra', reg: 'Os caminhos, as demandas, a lei e a vitória. O guerreiro que vai à frente e abre as estradas.',
    comidas: ['Feijoada', 'Inhame assado', 'Feijão mulatinho com carne', 'Manga-espada', 'Cerveja clara'],
    ervas: ['Espada-de-são-jorge', 'Lança-de-ogum', 'Aroeira', 'Peregum (pau-d’água)', 'Losna', 'Comigo-ninguém-pode'],
    ferr: 'Espada, lança e mariwô (franja da folha do dendezeiro)', sinc: 'São Jorge', festa: '23 de abril' },
  { k: 'oxossi', n: 'Oxóssi', s: 'Okê Arô!', dia: 'Quinta-feira', cor: 'Verde (e azul-turquesa)', cores: ['#2f8f46', '#7fd1ff'], elem: 'Matas', reg: 'As matas, a caça, a fartura e o conhecimento. O caçador de uma flecha só, que nunca erra o alvo.',
    comidas: ['Axoxô (milho vermelho cozido com lascas de coco)', 'Cesta de frutas', 'Milho verde', 'Mel', 'Vinho tinto ou cerveja'],
    ervas: ['Guiné', 'Alecrim', 'Eucalipto', 'Abre-caminho', 'Jurema', 'Alecrim-do-campo'],
    ferr: 'Ofá (arco e flecha) e eruquerê', sinc: 'São Sebastião', festa: '20 de janeiro' },
  { k: 'xango', n: 'Xangô', s: 'Kaô Kabecilê!', dia: 'Quarta-feira', cor: 'Marrom (e vermelho e branco)', cores: ['#8a5a2b', '#ffffff', '#c8302a'], elem: 'Fogo e pedreiras', reg: 'A justiça, a razão e o equilíbrio. O rei que pesa as ações de cada um.',
    comidas: ['Amalá (quiabo com rabada, cebola e dendê)', 'Quiabo em rodelas', 'Rabada', 'Abacaxi e maçã', 'Cerveja preta'],
    ervas: ['Folha de café', 'Quebra-pedra', 'Levante', 'Louro', 'Erva-de-são-joão', 'Nega-mina'],
    ferr: 'Oxê (machado de duas lâminas) e xerê', sinc: 'São Jerônimo (e São João)', festa: '30 de setembro' },
  { k: 'iansa', n: 'Iansã', s: 'Eparrey, Oyá!', dia: 'Quarta-feira', cor: 'Amarelo, coral e vermelho', cores: ['#f2c12e', '#e0603a'], elem: 'Ar e fogo', reg: 'Os ventos, os raios, as tempestades e a condução dos espíritos desencarnados.',
    comidas: ['Acarajé', 'Abará', 'Manga-rosa', 'Champanhe ou vinho rosé'],
    ervas: ['Espada-de-santa-bárbara', 'Folha de bambu', 'Cinamomo (pára-raio)', 'Louro', 'Erva-de-santa-bárbara', 'Gerânio'],
    ferr: 'Espada, eruexim (rabo de cavalo) e chifre de búfalo', sinc: 'Santa Bárbara', festa: '4 de dezembro' },
  { k: 'nana', n: 'Nanã', s: 'Saluba, Nanã!', dia: 'Sábado', cor: 'Lilás e roxo', cores: ['#9a7bc8', '#ffffff'], elem: 'Lama e águas paradas', reg: 'A sabedoria dos mais velhos, a lama de onde veio a vida, o nascimento e a passagem.',
    comidas: ['Aberém (bolinho de milho na folha de bananeira)', 'Batata-doce roxa', 'Canjica com leite de coco', 'Berinjela', 'Mingau de tapioca'],
    ervas: ['Manacá', 'Assa-peixe', 'Colônia', 'Quaresmeira', 'Alfavaca-roxa'],
    ferr: 'Ibiri (feixe de palha enfeitado com búzios)', sinc: 'Sant’Ana', festa: '26 de julho' },
  { k: 'omulu', n: 'Omulu / Obaluaiê', s: 'Atotô!', dia: 'Segunda-feira', cor: 'Preto, branco e vermelho', cores: ['#111111', '#ffffff', '#c8302a'], elem: 'Terra', reg: 'A cura, as doenças, a terra e a transformação. O médico dos pobres, coberto de palha.',
    comidas: ['Doburu (pipoca, a flor de Obaluaiê)', 'Pipoca com lascas de coco', 'Feijão-preto cozido', 'Farofa de dendê'],
    ervas: ['Canela-de-velho', 'Pinhão-roxo', 'Mamona', 'Assa-peixe', 'Sete-sangrias', 'Barba-de-velho'],
    ferr: 'Xaxará (feixe de palha e búzios) e filá de palha-da-costa', sinc: 'São Lázaro e São Roque', festa: '16 de agosto' },
  { k: 'ibeji', n: 'Ibeji', s: 'Oni Beijada!', dia: 'Domingo', cor: 'Rosa, azul-claro e colorido', cores: ['#f08cbc', '#6fb6ea', '#ffe066'], elem: 'A pureza', reg: 'A alegria, a inocência, a renovação e a proteção das crianças.',
    comidas: ['Caruru', 'Doces e balas', 'Bolo', 'Guaraná', 'Frutas'],
    ervas: ['Alfazema', 'Manjericão', 'Hortelã', 'Rosa branca', 'Folha de goiabeira', 'Camomila'],
    ferr: 'Brinquedos, doces e duas cabaças', sinc: 'São Cosme e São Damião', festa: '27 de setembro' }
];
const LINHAS = [
  { k: 'caboclo', n: 'Caboclos', s: 'Okê, Caboclo!', dia: 'Quinta-feira', cor: 'Verde e branco', cores: ['#2f8f46', '#ffffff'], orixa: 'Oxóssi',
    reg: 'Espíritos de indígenas brasileiros, guerreiros das matas. Trabalham com passes, cura, desobsessão e conselhos firmes.',
    comidas: ['Frutas variadas', 'Milho verde', 'Mandioca e mel', 'Charuto', 'Vinho tinto ou cerveja'],
    ervas: ['Guiné', 'Alecrim', 'Eucalipto', 'Jurema', 'Arruda'], ferr: 'Cocar, arco e flecha, penacho e charuto' },
  { k: 'pretovelho', n: 'Pretos-Velhos', s: 'Adorei as Almas!', dia: 'Segunda-feira', cor: 'Preto e branco', cores: ['#111111', '#ffffff'], orixa: 'Omulu e Nanã (Linha das Almas)',
    reg: 'Espíritos de anciãos africanos e afro-brasileiros que viveram a escravidão. Ensinam humildade e paciência; rezam, benzem e aconselham.',
    comidas: ['Café preto', 'Bolo de fubá', 'Rapadura e pé-de-moleque', 'Fumo de rolo para o cachimbo', 'Vela branca'],
    ervas: ['Arruda', 'Guiné', 'Alecrim', 'Manjericão', 'Espada-de-são-jorge'], ferr: 'Cachimbo, terço, banquinho, bengala e chapéu de palha' },
  { k: 'boiadeiro', n: 'Boiadeiros', s: 'Getruá, Boiadeiro!', dia: 'Quinta-feira (varia por casa)', cor: 'Marrom e amarelo', cores: ['#8a5a2b', '#e9c46a'], orixa: 'Oxóssi e Iansã',
    reg: 'Espíritos de vaqueiros e tocadores de boiada do sertão. Fortes e diretos, abrem caminhos, cortam demandas e laçam espíritos perdidos.',
    comidas: ['Carne-seca com abóbora', 'Feijão-tropeiro', 'Farofa de carne-seca', 'Cachaça', 'Fumo de corda e cigarro de palha'],
    ervas: ['Arruda', 'Guiné', 'Alecrim', 'Espada-de-são-jorge', 'Capim-limão'], ferr: 'Chapéu de couro, laço, chicote e berrante' },
  { k: 'crianca', n: 'Crianças (Erês)', s: 'Oni Beijada!', dia: 'Domingo', cor: 'Rosa e azul-claro', cores: ['#f08cbc', '#6fb6ea'], orixa: 'Ibeji',
    reg: 'Espíritos de crianças, puros e alegres. Quebram a tristeza, limpam o ambiente e trazem renovação.',
    comidas: ['Doces, balas e pirulitos', 'Bolo', 'Guaraná', 'Frutas doces', 'Cocada'],
    ervas: ['Alfazema', 'Manjericão', 'Hortelã', 'Rosa branca', 'Camomila'], ferr: 'Brinquedos, chupeta, cata-vento e doces' },
  { k: 'baiano', n: 'Baianos', s: 'Salve a Bahia!', dia: 'Varia por casa', cor: 'Amarelo e branco', cores: ['#f2c12e', '#ffffff'], orixa: 'Iansã e Xangô',
    reg: 'Espíritos alegres e espertos, ligados ao Nordeste. Desmancham feitiços e aconselham com bom humor e firmeza.',
    comidas: ['Cocada', 'Coco verde', 'Farofa com carne-seca', 'Acarajé', 'Batida de coco'],
    ervas: ['Arruda', 'Guiné', 'Alecrim', 'Levante', 'Pinhão-roxo'], ferr: 'Chapéu de palha ou de couro, coco e facão' },
  { k: 'marinheiro', n: 'Marinheiros', s: 'Salve a Marujada!', dia: 'Sábado', cor: 'Azul-marinho e branco', cores: ['#1f63a8', '#ffffff'], orixa: 'Iemanjá',
    reg: 'Espíritos de marujos e pescadores. Gingam como no balanço do mar e descarregam as energias pesadas, levando-as para as águas.',
    comidas: ['Peixe frito', 'Camarão', 'Rum', 'Cachaça', 'Cigarro'],
    ervas: ['Colônia', 'Alfazema', 'Pata-de-vaca', 'Arruda', 'Algas do mar'], ferr: 'Quepe, âncora, leme e garrafa' },
  { k: 'cigano', n: 'Ciganos', s: 'Optchá!', dia: 'Varia por casa', cor: 'Colorido, com dourado e vermelho', cores: ['#7b3fa0', '#f2c12e', '#c8302a'], orixa: 'Linha do Oriente',
    reg: 'Espíritos do povo cigano. Trabalham a liberdade, o amor, a prosperidade, a leitura da sorte e a força dos cristais e perfumes.',
    comidas: ['Frutas: uva, maçã e romã', 'Pão e vinho', 'Moedas douradas', 'Incenso e perfume', 'Flores coloridas'],
    ervas: ['Canela', 'Cravo', 'Rosa vermelha', 'Alecrim', 'Lavanda'], ferr: 'Lenço, pandeiro, baralho, punhal, moedas e cristais' },
  { k: 'exu', n: 'Exus', s: 'Laroyê, Exu!', s2: 'Exu é Mojubá!', dia: 'Segunda-feira', cor: 'Preto e vermelho', cores: ['#c8302a', '#111111'], orixa: 'Guardiões da casa',
    reg: 'Guardiões e mensageiros. Protegem a porteira e a casa, abrem e fecham caminhos e cortam demandas, sempre sob a lei de Umbanda.',
    comidas: ['Padê (farofa de dendê)', 'Cachaça', 'Charuto', 'Carne bovina', 'Pimenta'],
    ervas: ['Arruda', 'Guiné', 'Comigo-ninguém-pode', 'Pimenteira', 'Mamona'], ferr: 'Capa, cartola, tridente e chaves' },
  { k: 'pombagira', n: 'Pombagiras', s: 'Laroyê, Pombagira!', s2: 'Salve as Moças!', dia: 'Segunda-feira', cor: 'Vermelho e preto', cores: ['#c8302a', '#111111'], orixa: 'Guardiãs da casa',
    reg: 'Guardiãs femininas. Cuidam do amor, da autoestima e dos caminhos afetivos, e cortam as energias negativas com firmeza.',
    comidas: ['Champanhe ou sidra', 'Rosas vermelhas', 'Cigarrilha', 'Maçã', 'Perfume'],
    ervas: ['Rosa vermelha', 'Canela', 'Cravo', 'Arruda', 'Dama-da-noite'], ferr: 'Rosa, leque, saia rodada e taça' },
  { k: 'malandro', n: 'Malandros', s: 'Salve a Malandragem!', s2: 'Salve, Seu Zé!', dia: 'Varia por casa', cor: 'Branco e vermelho', cores: ['#ffffff', '#c8302a'], orixa: 'Linha de Seu Zé Pelintra',
    reg: 'Espíritos da boemia, como Seu Zé Pelintra. Espertos e justos, ajudam nas dificuldades da vida, no trabalho e na proteção.',
    comidas: ['Cerveja', 'Cachaça', 'Cigarro', 'Petiscos de boteco', 'Cravo vermelho na lapela'],
    ervas: ['Arruda', 'Guiné', 'Manjericão', 'Alecrim', 'Cravo'], ferr: 'Chapéu panamá, terno branco, gravata vermelha e bengala' }
];

window.AXE = { ORIXAS, LINHAS, medalhao, SYM: Y, SCENE: S, ART };
})();
