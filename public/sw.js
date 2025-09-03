const CACHE_NAME = 'dubeditter-cache-v2';
const IMG_CACHE = 'dubeditter-imgs-v1';
const MAX_IMG_ENTRIES = 60;
const OFFLINE_URL = '/offline.html';
const PRECACHE = [
  '/',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/manifest.json',
  OFFLINE_URL,
];

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  // delete oldest first
  for (let i = 0; i < keys.length - maxItems; i++) {
    await cache.delete(keys[i]);
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if (![CACHE_NAME, IMG_CACHE].includes(k)) return caches.delete(k);
    }))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Image runtime cache (cache-first)
  if (req.destination === 'image') {
    event.respondWith((async () => {
      const cache = await caches.open(IMG_CACHE);
      const cached = await cache.match(req, { ignoreVary: true, ignoreSearch: true });
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok) {
          cache.put(req, res.clone());
          trimCache(IMG_CACHE, MAX_IMG_ENTRIES);
        }
        return res;
      } catch (e) {
        // fallback: try offline page image or let it fail
        return await caches.match('/favicon.png') || Response.error();
      }
    })());
    return;
  }

  // Everything else: cache-first with network fallback to offline page
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // cache same-origin successful responses
        const okToCache = res.status === 200 && req.url.startsWith(self.location.origin);
        if (okToCache) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => caches.match(OFFLINE_URL));
    })
  );
});