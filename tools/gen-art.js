// Gera as estampas (SVG) dos orixás e das linhas a partir dos desenhos de orixas.js.
// Uso: node tools/gen-art.js  → escreve art/<chave>.svg
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { window: {}, Math, Array };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'orixas.js'), 'utf8'), ctx);
const { SYM, SCENE, ART } = ctx.window.AXE;

const GOLD = '#f7d77e';
const rep = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');
const shade = (hex, k) => { // k<0 escurece, k>0 clareia
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = k < 0 ? 0 : 255, a = Math.abs(k);
  r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
const SKIN = { d: '#5b3a24', m: '#7a4e30', l: '#a7714a' };

/* ---------- peças do corpo ---------- */
const robe = (c, c2) => `
<path d="M192 404 C206 362 250 350 300 350 C350 350 394 362 408 404 L474 770 L126 770 Z" fill="${c}"/>
<path d="M192 404 C206 362 250 350 300 350 C350 350 394 362 408 404 L474 770 L126 770 Z" fill="url(#robeShade)"/>
${[[262, 430, 228], [300, 440, 300], [338, 430, 372]].map(([x, y, x2]) => `<path d="M${x} ${y} Q${(x + x2) / 2 + 6} 600 ${x2} 770" stroke="${shade(c, -.35)}" stroke-width="3" fill="none" opacity=".45"/>`).join('')}
<path d="M204 470 Q300 506 396 470 L400 502 Q300 540 200 502 Z" fill="${c2}"/>`;
const guia = cores => rep(23, i => { const t = i / 22, a = Math.PI * (0.08 + 0.84 * t); const x = 300 - Math.cos(a) * 64, y = 356 + Math.sin(a) * 74; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.2" fill="${cores[i % cores.length]}" stroke="rgba(0,0,0,.35)" stroke-width="1"/>`; });
const neckHead = skin => `<rect x="279" y="292" width="42" height="70" rx="14" fill="${skin}"/><ellipse cx="300" cy="252" rx="52" ry="62" fill="${skin}"/><ellipse cx="300" cy="252" rx="52" ry="62" fill="url(#faceShade)"/>`;
const arm = (x1, y1, x2, y2, sleeve, skin, w = 44) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + (x2 > 300 ? 18 : -18)} ${(y1 + y2) / 2 + 6} ${x2} ${y2}" stroke="${sleeve}" stroke-width="${w}" stroke-linecap="round" fill="none"/><path d="M${x1} ${y1} Q${(x1 + x2) / 2 + (x2 > 300 ? 18 : -18)} ${(y1 + y2) / 2 + 6} ${x2} ${y2}" stroke="rgba(0,0,0,.18)" stroke-width="${w}" stroke-linecap="round" fill="none" stroke-dasharray="0 ${w} 999" /><circle cx="${x2}" cy="${y2 - 6}" r="19" fill="${skin}"/>`;
const tool = (key, hx, hy, s = 1.55, rot = 0, ax = 100, ay = 140) => `<g transform="translate(${hx} ${hy}) rotate(${rot}) scale(${s}) translate(${-ax} ${-ay})" filter="url(#tshadow)">${SYM[key]()}</g>`;

/* ---------- cabeças ---------- */
const H = {
  ade: (crown, fringe, top = '') => `<path d="M244 214 L248 168 L270 190 L285 152 L300 182 L315 152 L330 190 L352 168 L356 214 Z" fill="${crown}" stroke="${shade(crown, -.35)}" stroke-width="2"/>
<rect x="242" y="206" width="116" height="14" rx="5" fill="${shade(crown, -.15)}"/>${top}
${rep(13, i => { const x = 250 + i * 8.3; return rep(10, j => `<circle cx="${x.toFixed(1)}" cy="${226 + j * 9.4}" r="3.4" fill="${Array.isArray(fringe) ? fringe[(i + j) % fringe.length] : fringe}"/>`); })}`,
  mariwo: () => `<path d="M246 214 C248 160 352 160 354 214 Z" fill="#9aa4b4" stroke="#5b6475" stroke-width="2"/><path d="M276 168 L300 132 L324 168" fill="#c8302a" stroke="#7a1612" stroke-width="2"/>
${rep(17, i => { const x = 244 + i * 7; return `<path d="M${x} 214 q${i % 2 ? 3 : -3} 46 ${i % 3 - 1} ${92 + (i % 4) * 6}" stroke="${i % 2 ? '#b9d36b' : '#8fae4a'}" stroke-width="4" stroke-linecap="round" fill="none"/>`; })}`,
  palha: () => `<path d="M300 112 C222 160 168 330 134 560 L466 560 C432 330 378 160 300 112 Z" fill="#d6b45e"/>
${rep(38, i => { const x = 150 + i * 8; return `<path d="M${300 + (x - 300) * .15} ${130 + Math.abs(x - 300) * .2} Q${x} 420 ${x + (i % 2 ? 4 : -4)} ${560 + (i % 5) * 8}" stroke="${i % 3 ? '#b8933f' : '#f0d48a'}" stroke-width="3" fill="none"/>`; })}
${[[300, 300], [262, 360], [338, 360], [230, 440], [300, 430], [370, 440]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="9" fill="#fff" stroke="#3a2a08" stroke-width="1.5"/>`).join('')}
<path d="M300 112 l-10 -22 l10 8 l10 -8 z" fill="#c8302a"/>`,
  cocar: () => rep(13, i => { const a = Math.PI * (1.05 + i * 0.9 / 12); const x = 300 + Math.cos(a) * 92, y = 236 + Math.sin(a) * 92; return `<ellipse cx="${((300 + x) / 2 + Math.cos(a) * 20).toFixed(1)}" cy="${((236 + y) / 2 + Math.sin(a) * 20).toFixed(1)}" rx="54" ry="13" fill="${['#f7d77e', '#2f8f46', '#c8302a', '#ffffff'][i % 4]}" stroke="#3a2a08" stroke-width="1.5" transform="rotate(${(a * 180 / Math.PI).toFixed(1)} ${((300 + x) / 2 + Math.cos(a) * 20).toFixed(1)} ${((236 + y) / 2 + Math.sin(a) * 20).toFixed(1)})"/>`; }),
  cocarBand: () => `<path d="M248 214 Q300 196 352 214 L352 232 Q300 214 248 232 Z" fill="#c8302a" stroke="#7a1612" stroke-width="2"/>${rep(7, i => `<circle cx="${258 + i * 14}" cy="${219 - Math.sin(i / 6 * Math.PI) * 6}" r="3" fill="#f7d77e"/>`)}
<path d="M262 262 l16 4 M262 274 l16 2 M338 262 l-16 4 M338 274 l-16 2" stroke="#c8302a" stroke-width="3.5" stroke-linecap="round"/>`,
  chapeuPalha: () => `<ellipse cx="300" cy="206" rx="104" ry="24" fill="#e2c27a" stroke="#9a7b34" stroke-width="2"/><path d="M246 204 C246 150 354 150 354 204 Z" fill="#ecd08e" stroke="#9a7b34" stroke-width="2"/><path d="M248 192 Q300 202 352 192" stroke="#7a4a24" stroke-width="5" fill="none"/>${rep(8, i => `<path d="M${214 + i * 22} 200 l10 10" stroke="#b8933f" stroke-width="2"/>`)}`,
  chapeuCouro: () => `<path d="M188 214 C200 196 240 204 300 206 C360 204 400 196 412 214 C392 232 208 232 188 214 Z" fill="#7a4a24" stroke="#3b2210" stroke-width="2"/><path d="M248 208 C246 150 354 150 352 208 Z" fill="#8a5a2b" stroke="#3b2210" stroke-width="2"/>${rep(9, i => `<path d="M${200 + i * 25} 218 l6 6" stroke="#e9c46a" stroke-width="2.5"/>`)}<path d="M252 196 Q300 206 348 196" stroke="#e9c46a" stroke-width="4" fill="none"/>`,
  quepe: () => `<ellipse cx="300" cy="204" rx="62" ry="16" fill="#ffffff" stroke="#0a2448" stroke-width="2"/><path d="M244 206 C246 168 354 168 356 206 Z" fill="#ffffff" stroke="#0a2448" stroke-width="2"/><rect x="246" y="196" width="108" height="12" fill="#0a2448"/><circle cx="300" cy="186" r="6" fill="${GOLD}"/>`,
  cartola: () => `<ellipse cx="300" cy="206" rx="82" ry="16" fill="#111"/><rect x="254" y="104" width="92" height="104" rx="6" fill="#151515" stroke="#333" stroke-width="2"/><rect x="254" y="178" width="92" height="16" fill="#c8302a"/>`,
  panama: () => `<ellipse cx="300" cy="208" rx="100" ry="22" fill="#f5f2ea" stroke="#b9b2a0" stroke-width="2"/><path d="M248 208 C246 160 354 160 352 208 Z" fill="#fffdf6" stroke="#b9b2a0" stroke-width="2"/><path d="M250 192 L350 192 L351 206 L249 206 Z" fill="#c8302a"/>`,
  lenco: () => `<path d="M244 236 C232 168 368 168 356 236 C340 214 260 214 244 236 Z" fill="#c8302a" stroke="#7a1612" stroke-width="2"/>${rep(9, i => `<circle cx="${256 + i * 11}" cy="${226 + Math.sin(i / 8 * Math.PI) * 6}" r="5" fill="${GOLD}" stroke="#8a5a00" stroke-width="1"/>`)}
<path d="M356 232 C392 260 404 340 380 420 C372 360 364 300 350 270 Z" fill="#7b3fa0"/><path d="M244 232 C210 270 204 340 214 400 C226 340 236 300 250 270 Z" fill="#2a1a12"/>`,
  rosa: () => `<path d="M246 250 C230 180 262 166 300 168 C346 166 372 186 356 250 C352 216 334 200 300 200 C266 200 250 216 246 250 Z" fill="#1c1210"/><circle cx="300" cy="166" r="26" fill="#1c1210"/>
<circle cx="350" cy="196" r="22" fill="#b3132a" stroke="${GOLD}" stroke-width="2"/><path d="M350 196 m-5 0 a5 5 0 1 1 10 0 a10 10 0 1 1-18 5 a14 14 0 1 1 26 5" stroke="#ffb3b3" stroke-width="2.4" fill="none"/>
<path d="M246 250 C226 300 232 360 262 380 C244 330 246 290 256 262 Z M354 250 C374 300 368 360 338 380 C356 330 354 290 344 262 Z" fill="#1c1210"/>`,
  barba: (c = '#f4f1e8') => `<path d="M254 270 C258 330 280 352 300 354 C320 352 342 330 346 270 C330 296 270 296 254 270 Z" fill="${c}"/><path d="M268 286 Q300 300 332 286" stroke="${shade(c, -.25)}" stroke-width="3" fill="none"/>`,
  cabelo: (c = '#1c1210') => `<path d="M248 236 C240 180 272 178 300 178 C332 178 360 184 352 236 C344 206 326 198 300 198 C274 198 256 206 248 236 Z" fill="${c}"/>`
};

/* ---------- figuras ---------- */
const F = {
  oxala: () => ({ skin: SKIN.d, body: robe('#f4f1e8', '#ffffff') + guia(['#ffffff', '#e8e2d0']), arms: arm(208, 404, 182, 560, '#efe9d8', SKIN.d) + arm(392, 404, 452, 300, '#efe9d8', SKIN.d), head: H.barba() + H.ade('#e9e6dc', ['#ffffff', '#dfe6ef'], `<path d="M288 150 Q300 128 312 150 Q300 144 288 150Z" fill="#fff"/>`), tool: tool('oxala', 452, 290, 1.7, 0, 100, 150) }),
  iemanja: () => ({ skin: SKIN.m, body: robe('#6fb6ea', '#e8f6ff') + guia(['#bfe3ff', '#ffffff']) + `<path d="M196 404 C150 470 140 620 150 770 L190 770 C176 620 186 480 222 410 Z M404 404 C450 470 460 620 450 770 L410 770 C424 620 414 480 378 410 Z" fill="#dff2ff" opacity=".7"/>`, arms: arm(208, 404, 178, 556, '#8fcaf2', SKIN.m) + arm(392, 404, 448, 314, '#8fcaf2', SKIN.m), head: H.ade('#cfd8e3', ['#ffffff', '#bfe3ff', '#dff2ff']), tool: tool('iemanja', 448, 300, 1.45, 0, 100, 136) }),
  oxum: () => ({ skin: SKIN.m, body: robe('#f2c12e', '#fff0b3') + guia(['#f2c12e', '#d4a017', '#fff0b3']), arms: arm(208, 404, 180, 556, '#f5cd4f', SKIN.m) + arm(392, 404, 446, 314, '#f5cd4f', SKIN.m), head: H.ade('#e3b23c', ['#ffd166', '#f2c12e', '#fff0b3']), tool: tool('oxum', 446, 300, 1.45, 0, 100, 136) }),
  ogum: () => ({ skin: SKIN.d, body: `<path d="M180 400 C150 520 140 660 150 770 L450 770 C460 660 450 520 420 400 Z" fill="#c8302a"/>` + robe('#1f3f8f', '#c8302a') + `<path d="M232 380 Q300 352 368 380 L374 450 Q300 470 226 450 Z" fill="#b8c2d4" stroke="#5b6475" stroke-width="2"/>` + guia(['#c8302a', '#1f3f8f']), arms: arm(208, 404, 180, 556, '#9aa4b4', SKIN.d) + arm(392, 404, 450, 300, '#9aa4b4', SKIN.d), head: H.mariwo(), tool: tool('ogum', 452, 292, 1.75, 0, 92, 142) }),
  oxossi: () => ({ skin: SKIN.m, body: robe('#2f8f46', '#7fd1ff') + guia(['#2f8f46', '#7fd1ff']), arms: arm(208, 404, 230, 520, '#3fa95a', SKIN.m) + arm(392, 404, 446, 360, '#3fa95a', SKIN.m), head: H.ade('#3d9e57', ['#7fd1ff', '#2f8f46'], `<path d="M330 186 C350 140 372 130 380 120 C374 150 360 172 336 196Z" fill="#f7d77e" stroke="#8a5a00"/>`), tool: tool('oxossi', 330, 440, 1.6, 0, 100, 100) }),
  xango: () => ({ skin: SKIN.d, body: robe('#8a5a2b', '#c8302a') + `<path d="M204 470 Q300 506 396 470 L398 486 Q300 522 202 486 Z" fill="#ffffff"/>` + guia(['#8a5a2b', '#ffffff', '#c8302a']), arms: arm(208, 404, 180, 556, '#a06a35', SKIN.d) + arm(392, 404, 450, 300, '#a06a35', SKIN.d), head: H.ade('#d9a400', ['#c8302a', '#ffffff']), tool: tool('xango', 450, 300, 1.6, 0, 100, 150) }),
  iansa: () => ({ skin: SKIN.m, body: robe('#e0603a', '#f2c12e') + guia(['#f2c12e', '#e0603a']), arms: arm(208, 404, 168, 330, '#ea7a52', SKIN.m) + arm(392, 404, 452, 316, '#ea7a52', SKIN.m), head: H.ade('#c9772a', ['#ff9a6a', '#f2c12e']),
    tool: `<g filter="url(#tshadow)"><path d="M166 318 C150 260 132 210 104 160 L112 156 C142 204 162 254 176 314 Z" fill="#fff4dc" stroke="${GOLD}" stroke-width="3"/><path d="M150 330 L184 316" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>
<path d="M452 310 L468 230" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>${rep(11, i => `<path d="M468 230 Q${440 + i * 7} ${180 - (i % 3) * 8} ${428 + i * 9} ${140 + (i % 2) * 10}" stroke="#fff3c4" stroke-width="2.4" fill="none"/>`)}</g>` }),
  nana: () => ({ skin: SKIN.d, body: robe('#9a7bc8', '#ffffff') + guia(['#9a7bc8', '#ffffff']), arms: arm(208, 404, 180, 556, '#a98ad6', SKIN.d) + arm(392, 404, 430, 470, '#a98ad6', SKIN.d), head: H.ade('#8a6ab8', ['#d9c7ff', '#ffffff', '#9a7bc8']), tool: tool('nana', 432, 420, 1.6, 0, 92, 150) }),
  omulu: () => ({ skin: SKIN.d, body: robe('#2a1a12', '#c8302a'), arms: arm(208, 470, 176, 600, '#2a1a12', SKIN.d) + arm(392, 470, 440, 560, '#2a1a12', SKIN.d), head: H.palha(), tool: tool('omulu', 440, 540, 1.35, 0, 100, 100), headFirst: true }),
  caboclo: () => ({ skin: '#8a5a3a', body: robe('#2f8f46', '#ffffff') + `<path d="M126 690 L474 690 L474 770 L126 770Z" fill="#7a4a24"/>${rep(14, i => `<path d="M${140 + i * 24} 690 l-6 46 M${140 + i * 24} 690 l6 46" stroke="#f7d77e" stroke-width="3"/>`)}` + guia(['#c8302a', '#f7d77e', '#ffffff']), arms: arm(208, 404, 230, 520, '#8a5a3a', '#8a5a3a') + arm(392, 404, 446, 360, '#8a5a3a', '#8a5a3a'), back: H.cocar(), head: H.cocarBand(), tool: tool('oxossi', 330, 440, 1.6, 0, 100, 100) }),
  pretovelho: () => ({ skin: SKIN.d, body: robe('#f4f1e8', '#222222') + guia(['#111111', '#ffffff']), arms: arm(208, 404, 230, 500, '#ece6d6', SKIN.d) + arm(392, 404, 380, 500, '#ece6d6', SKIN.d), head: H.barba('#f4f1e8') + H.chapeuPalha(), tool: tool('pretovelho', 300, 520, 1.5, 0, 100, 112) }),
  boiadeiro: () => ({ skin: SKIN.m, body: robe('#8a5a2b', '#e9c46a') + rep(8, i => `<path d="M${214 + i * 24} 560 l-4 22" stroke="#e9c46a" stroke-width="3"/>`) + guia(['#8a5a2b', '#e9c46a']), arms: arm(208, 404, 180, 556, '#7a4a24', SKIN.m) + arm(392, 404, 446, 330, '#7a4a24', SKIN.m), head: H.chapeuCouro(), tool: `<g filter="url(#tshadow)"><circle cx="452" cy="420" r="48" fill="none" stroke="#f2c98a" stroke-width="7"/><circle cx="452" cy="420" r="36" fill="none" stroke="#e0b06a" stroke-width="5"/><path d="M446 330 C470 360 480 380 470 380" stroke="#f2c98a" stroke-width="6" fill="none"/><path d="M150 560 C130 520 128 480 160 470 L176 486 C156 498 160 520 172 552 Z" fill="#e8d5b0" stroke="#7a4a24" stroke-width="3"/></g>` }),
  baiano: () => ({ skin: SKIN.d, body: robe('#ffffff', '#f2c12e') + guia(['#f2c12e', '#ffffff']), arms: arm(208, 404, 180, 556, '#f5f2ea', SKIN.d) + arm(392, 404, 446, 330, '#f5f2ea', SKIN.d), head: H.chapeuPalha(), tool: `<g filter="url(#tshadow)"><circle cx="452" cy="300" r="36" fill="#6a4a2a" stroke="#3b2210" stroke-width="3"/><path d="M430 284 q22-12 44 0" stroke="#3b2210" stroke-width="3" fill="none"/><circle cx="444" cy="292" r="4" fill="#3b2210"/><circle cx="458" cy="290" r="4" fill="#3b2210"/></g>` }),
  marinheiro: () => ({ skin: SKIN.m, body: robe('#ffffff', '#0a2448') + `<path d="M232 370 L300 440 L368 370 L380 402 L300 470 L220 402 Z" fill="#1f63a8"/><path d="M286 440 L300 470 L314 440 Z" fill="#c8302a"/>`, arms: arm(208, 404, 180, 556, '#f5f2ea', SKIN.m) + arm(392, 404, 450, 330, '#f5f2ea', SKIN.m), head: H.quepe(), tool: tool('marinheiro', 452, 470, 1.25, 0, 100, 104) }),
  cigano: () => ({ skin: SKIN.l, body: robe('#7b3fa0', '#c8302a') + `<path d="M150 640 Q300 690 450 640 L474 770 L126 770 Z" fill="#c8302a"/><path d="M150 640 Q300 690 450 640" stroke="${GOLD}" stroke-width="5" fill="none"/>` + guia(['#f2c12e', '#c8302a', '#2f8f46']), arms: arm(208, 404, 180, 556, '#8e4cb8', SKIN.l) + arm(392, 404, 446, 320, '#8e4cb8', SKIN.l), head: H.lenco() + `<circle cx="248" cy="290" r="9" fill="none" stroke="${GOLD}" stroke-width="3"/><circle cx="352" cy="290" r="9" fill="none" stroke="${GOLD}" stroke-width="3"/>`, tool: tool('cigano', 450, 300, 1.25, 0, 100, 92) }),
  exu: () => ({ skin: SKIN.d, body: `<path d="M170 392 C130 520 120 660 126 770 L474 770 C480 660 470 520 430 392 Z" fill="#b3201f"/><path d="M190 392 C160 520 156 660 162 770 L438 770 C444 660 440 520 410 392 Z" fill="#111"/>` + robe('#151515', '#c8302a') + `<path d="M276 356 L300 420 L324 356 Z" fill="#ffffff"/><path d="M294 380 L300 420 L306 380 Z" fill="#c8302a"/>`, arms: arm(208, 404, 180, 556, '#1c1c1c', SKIN.d) + arm(392, 404, 450, 330, '#1c1c1c', SKIN.d), head: H.cartola(), tool: tool('exu', 452, 400, 1.6, 0, 100, 120) }),
  pombagira: () => ({ skin: SKIN.m, body: robe('#b3132a', '#111111') + `<path d="M150 600 Q300 650 450 600 L474 770 L126 770 Z" fill="#8e0f22"/><path d="M196 404 C220 440 380 440 404 404 L410 430 C380 470 220 470 190 430 Z" fill="#111"/>`, arms: arm(208, 404, 180, 556, SKIN.m, SKIN.m, 34) + arm(392, 404, 446, 330, SKIN.m, SKIN.m, 34), head: H.rosa(), tool: tool('pombagira', 448, 312, 1.3, 0, 100, 150) }),
  malandro: () => ({ skin: SKIN.d, body: robe('#f5f2ea', '#c8302a') + `<path d="M276 356 L300 430 L324 356 Z" fill="#c8302a"/><path d="M262 356 L300 400 L338 356" stroke="#d9d2bd" stroke-width="5" fill="none"/>`, arms: arm(208, 404, 186, 540, '#f5f2ea', SKIN.d) + arm(392, 404, 430, 520, '#f5f2ea', SKIN.d), head: H.panama(), tool: `<g filter="url(#tshadow)"><path d="M430 520 L470 760" stroke="#2a1a12" stroke-width="9" stroke-linecap="round"/><path d="M430 520 C424 490 446 476 460 492" stroke="#2a1a12" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="433" cy="518" r="6" fill="${GOLD}"/></g>` })
};
// crianças: duas figuras pequenas (Ibeji e Erês)
function kids(c1, c2, toolKey) {
  const kid = (cx, c, skin, flip) => `<g transform="translate(${cx} 0)">
<path d="M-70 520 C-62 476 -34 466 0 466 C34 466 62 476 70 520 L92 770 L-92 770 Z" fill="${c}"/>
<rect x="-14" y="420" width="28" height="52" rx="10" fill="${skin}"/><circle cx="0" cy="388" r="46" fill="${skin}"/><circle cx="0" cy="388" r="46" fill="url(#faceShade)"/>
<path d="M-46 380 C-50 330 50 330 46 380 C34 358 -34 358 -46 380Z" fill="#1c1210"/>
<path d="M-18 392 q6 -6 12 0 M6 392 q6 -6 12 0" stroke="#2a1a12" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-12 410 q12 10 24 0" stroke="#2a1a12" stroke-width="3" fill="none" stroke-linecap="round"/>
<circle cx="-24" cy="404" r="6" fill="#ff9ccc" opacity=".6"/><circle cx="24" cy="404" r="6" fill="#ff9ccc" opacity=".6"/>
<path d="M${flip ? 60 : -60} 520 Q${flip ? 76 : -76} 470 ${flip ? 92 : -92} 430" stroke="${skin}" stroke-width="22" stroke-linecap="round" fill="none"/></g>`;
  return { kids: kid(220, c1, SKIN.m, false) + kid(380, c2, SKIN.d, true) + `<path d="M262 560 Q300 584 338 560" stroke="${SKIN.m}" stroke-width="22" stroke-linecap="round" fill="none"/>`
    + (toolKey === 'ibeji' ? `<g filter="url(#tshadow)"><path d="M128 430 V300" stroke="#fff" stroke-width="5"/><circle cx="128" cy="290" r="26" fill="#fff"/><path d="M128 290 m0-14 a14 14 0 1 1-12 8 a8 8 0 1 1 13 3" stroke="#ff6fa8" stroke-width="3.5" fill="none"/><ellipse cx="472" cy="300" rx="30" ry="36" fill="#7fd1ff" stroke="#fff" stroke-width="3"/><path d="M472 336 Q466 380 478 430" stroke="#fff" stroke-width="2.5" fill="none"/></g>`
      : `<g transform="translate(472 330) scale(1.3) translate(-86 -90)" filter="url(#tshadow)">${SYM.crianca()}</g>`) };
}

const CENA = {
  ogum: () => `<path d="M100 200 L100 120 M0 120 L200 120" stroke="#fff" stroke-width="1.2" opacity=".2"/>` + rep(6, i => `<path d="M${10 + i * 6} 200 L${40 + i * 10} 120" stroke="#fff" stroke-width=".8" opacity=".12"/>`),
  xango: () => [[20, 190, 34, 14], [180, 190, 34, 14], [100, 198, 60, 10]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3a2410" stroke="#c9a26a" stroke-width="1"/>`).join('') + `<path d="M160 30 l-10 18 h8 l-8 16" stroke="#fff3b0" stroke-width="1.5" fill="none" opacity=".6"/>`
};
function estampa(key) {
  const a = ART[key];
  const fig = key === 'ibeji' ? kids('#f08cbc', '#6fb6ea', 'ibeji') : key === 'crianca' ? kids('#7fd1ff', '#ffd166', 'crianca') : F[key]();
  const arch = 'M30 770 V300 A270 270 0 0 1 570 300 V770 Z';
  const bodyPart = fig.kids ? fig.kids : `${fig.back || ''}${fig.body}${fig.headFirst ? fig.arms + neckHead(fig.skin) + fig.head : neckHead(fig.skin) + fig.head + fig.arms}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
<defs>
<radialGradient id="bg" cx="50%" cy="32%" r="80%"><stop offset="0" stop-color="${a.bg[0]}"/><stop offset="1" stop-color="${a.bg[1]}"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6cf" stop-opacity=".95"/><stop offset=".55" stop-color="#f7d77e" stop-opacity=".45"/><stop offset="1" stop-color="#f7d77e" stop-opacity="0"/></radialGradient>
<linearGradient id="robeShade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
<linearGradient id="faceShade" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".55" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity=".06"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
<clipPath id="arch"><path d="${arch}"/></clipPath>
<filter id="tshadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
</defs>
<rect width="600" height="800" rx="28" fill="#0d1f5c"/>
<g clip-path="url(#arch)">
<rect width="600" height="800" fill="url(#bg)"/>
<g transform="scale(3)">${CENA[key] ? CENA[key]() : a.cena()}</g>
<circle cx="300" cy="250" r="170" fill="url(#halo)"/>
${rep(24, i => { const t = i * Math.PI / 12; return `<path d="M${300 + Math.cos(t) * 120} ${250 + Math.sin(t) * 120} L${300 + Math.cos(t) * 200} ${250 + Math.sin(t) * 200}" stroke="#fff6cf" stroke-width="2" opacity=".28"/>`; })}
${bodyPart}
${fig.tool || ''}
<rect y="600" width="600" height="200" fill="url(#floor)"/>
</g>
<path d="${arch}" fill="none" stroke="${GOLD}" stroke-width="6"/>
<path d="M14 786 V300 A286 286 0 0 1 586 300 V786 Z" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity=".7"/>
${rep(31, i => { const t = Math.PI + i * Math.PI / 30; const c = a.contas[i % a.contas.length]; return `<circle cx="${(300 + Math.cos(t) * 286).toFixed(1)}" cy="${(300 + Math.sin(t) * 286).toFixed(1)}" r="6.5" fill="${c}" stroke="rgba(0,0,0,.4)" stroke-width="1"/>`; })}
</svg>`;
}

const out = path.join(__dirname, '..', 'art'); fs.mkdirSync(out, { recursive: true });
const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ART);
keys.forEach(k => fs.writeFileSync(path.join(out, k + '.svg'), estampa(k)));
console.log('ok', keys.length);
