/*
  Service worker de Biblia Menorah.
  - Páginas: primero la red (para recibir siempre la versión nueva); sin conexión, la última copia.
  - Archivos de /assets (tienen hash en el nombre, nunca cambian): primero la caché.
  - La Biblia y los estudios no pasan por aquí: viven en IndexedDB.
*/
const VERSION = 'v1';
const SHELL = `biblia-shell-${VERSION}`;
const ASSETS = `biblia-assets-${VERSION}`;
const PRECACHE = ['/', '/manifest.webmanifest', '/favicon/web-app-manifest-192x192.png', '/favicon/web-app-manifest-512x512.png'];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => ![SHELL, ASSETS].includes(k)).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return; // API e imágenes remotas: sin intervenir

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(SHELL).then((c) => c.put('/', copy));
                    return res;
                })
                .catch(() => caches.match('/').then((r) => r || Response.error()))
        );
        return;
    }

    if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/favicon/') || url.pathname.startsWith('/images/')) {
        event.respondWith(
            caches.match(request).then(
                (cached) =>
                    cached ||
                    fetch(request).then((res) => {
                        if (res.ok) {
                            const copy = res.clone();
                            caches.open(ASSETS).then((c) => c.put(request, copy));
                        }
                        return res;
                    })
            )
        );
    }
});
