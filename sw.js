/* Guarda o app no celular para abrir sem internet. Troque VERSION a cada atualização. */
const VERSION = 'tenda-v2.2.0';
const FILES = [
  './', 'index.html', 'app.css', 'app.js', 'orixas.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/logo-320.png',
  'fonts/alegreya-latin-700-normal.woff2', 'fonts/alegreya-latin-800-normal.woff2',
  'fonts/alegreya-sans-latin-400-normal.woff2', 'fonts/alegreya-sans-latin-500-normal.woff2',
  'fonts/alegreya-sans-latin-700-normal.woff2', 'fonts/alegreya-sans-latin-800-normal.woff2',
  'fonts/caveat-latin-600-normal.woff2', 'fonts/caveat-latin-700-normal.woff2',
  'art/oxala.svg', 'art/iemanja.svg', 'art/oxum.svg', 'art/ogum.svg', 'art/oxossi.svg', 'art/xango.svg', 'art/iansa.svg', 'art/nana.svg', 'art/omulu.svg', 'art/ibeji.svg', 'art/caboclo.svg', 'art/pretovelho.svg', 'art/boiadeiro.svg', 'art/crianca.svg', 'art/baiano.svg', 'art/marinheiro.svg', 'art/cigano.svg', 'art/exu.svg', 'art/pombagira.svg', 'art/malandro.svg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Rede primeiro para a página (pega atualizações), cache primeiro para o resto.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put('./', copy)); return r; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return r; })));
});
